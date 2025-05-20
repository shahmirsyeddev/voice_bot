// rnnoise.js
import initRNNoise, { RNNoise } from "@timephy/rnnoise-wasm";

export async function createRNNoise(sampleRate = 48000) {
  const RNModule = await initRNNoise();
  // create an RNNoise processor instance
  const rnInstance = new RNModule.NoiseSuppressor(sampleRate);
  return rnInstance;
}
