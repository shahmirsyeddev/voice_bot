// lib/openai.js
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAssistantReply(currentQ, userAnswer, nextQ) {
  const messages = [
    {
      role: "system",
      content:
        "You are a friendly assistant helping users fill out a business questionnaire. Handle interruptions kindly. Return to the current question after addressing unrelated questions.",
    },
    {
      role: "user",
      content: `Current question: "${currentQ.questionText}".\nUser said: "${userAnswer}".`,
    },
  ];

  if (nextQ) {
    messages.push({
      role: "user",
      content: `After this, the next question is: "${nextQ.questionText}".`,
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}
