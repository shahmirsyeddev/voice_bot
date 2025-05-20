// worklet-processor.js
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs /*, outputs, parameters*/) {
    const input = inputs[0];
    if (input && input[0]) {
      // Copy the Float32 array and send to main thread
      const floatFrame = new Float32Array(input[0]);
      this.port.postMessage(floatFrame);
    }
    return true; // keep processor alive
  }
}

registerProcessor("pcm-processor", PCMProcessor);
