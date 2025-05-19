// lib/azureTTS.js
import axios from "axios";
import "dotenv/config";

export async function synthesizeSpeech(text) {
  const endpoint = `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const ssml = `<speak version='1.0' xml:lang='en-US'>
    <voice name='en-US-JennyNeural'>${text}</voice>
  </speak>`;

  const response = await axios.post(endpoint, ssml, {
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
    },
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data);
}
