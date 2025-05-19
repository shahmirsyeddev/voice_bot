// lib/dialogManager.js
import { generateAssistantReply } from "./openai.js";
import { synthesizeSpeech } from "./azureTTS.js";

export async function handleUserMessage(
  ws,
  session,
  userText,
  forceMessage = null
) {
  const { flow, currentIndex, answers } = session;

  const isIntro = userText === null;
  const currentQ = flow[currentIndex];
  const nextQ = flow[currentIndex + 1];
  const isLast = currentIndex === flow.length - 1;

  const prompt = isIntro
    ? forceMessage || `Let's begin. ${currentQ.questionText}`
    : await generateAssistantReply(currentQ, userText, nextQ);

  const audioBuffer = await synthesizeSpeech(prompt);

  if (!isIntro && prompt.includes(currentQ.questionText)) {
    // GPT decided to repeat the same question
    return ws.send(
      JSON.stringify({
        type: "assistant_response",
        text: prompt,
        audio: audioBuffer.toString("base64"),
      })
    );
  }

  if (!isIntro && userText) {
    session.answers[currentQ.id] = userText;
    if (!isLast) {
      session.currentIndex += 1;
    } else {
      session.completed = true;
    }
  }

  ws.send(
    JSON.stringify({
      type: "assistant_response",
      text: prompt,
      audio: audioBuffer.toString("base64"),
    })
  );
}
