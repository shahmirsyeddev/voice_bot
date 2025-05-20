// vad.js
import initVADModule, { VADMode, VADEvent } from "@echogarden/fvad-wasm";

export async function createVAD(sampleRate = 48000) {
  const VADModule = await initVADModule();
  // Use AGGRESSIVE mode for reliable endpointing:
  const vadInstance = new VADModule.VAD(VADMode.AGGRESSIVE, sampleRate);
  return { vadInstance, VADModule };
}
