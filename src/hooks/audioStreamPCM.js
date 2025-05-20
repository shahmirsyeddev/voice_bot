// useAudioStreamPCM.js
import { useEffect, useRef } from "react";
import { useAIStore } from "./store"; // your Zustand store
import { createVAD } from "@/components/audioPipeline/vad";
import { createRNNoise } from "@/components/audioPipeline/rnnnoise";

export function useAudioStreamPCM() {
  const {
    setIsListening,
    setIsThinking,
    addFinalTranscript,
    updatePartialTranscript,
  } = useAIStore();
  const contextRef = useRef(null);
  const socketRef = useRef(null);
  const bufferRef = useRef(new Int16Array()); // accumulate PCM here
  const lastVoiceTimeRef = useRef(Date.now());
  const vadRef = useRef(null);
  const rnRef = useRef(null);

  useEffect(() => {
    async function startStreaming() {
      try {
        console.log("[Audio] Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("[Audio] Microphone access granted");
        setIsListening(true);

        const audioCtx = new AudioContext();
        contextRef.current = audioCtx;
        await audioCtx.audioWorklet.addModule("worklet-processor.js");
        console.log("[Audio] Worklet initialised and running");

        // Initialize VAD and RNNoise
        vadRef.current = await createVAD(audioCtx.sampleRate);
        rnRef.current = await createRNNoise(audioCtx.sampleRate);
        console.log("[Audio] VAD and RNNoise modules initialized");

        // Set up WebSocket
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS}`);
        socketRef.current = ws;
        ws.binaryType = "arraybuffer";
        ws.onopen = () => console.log("[WebSocket] Connection opened");
        ws.onmessage = (ev) => {
          const msg = JSON.parse(ev.data);
          console.log("[WebSocket] Received message:", msg);
          if (msg.type === "partial") {
            updatePartialTranscript(msg.text);
          } else if (msg.type === "final") {
            addFinalTranscript(msg.text);
            setIsThinking(false);
          } else if (msg.type === "assistant") {
            addFinalTranscript(msg.text);
            setIsThinking(false);
          }
        };

        // Create audio graph
        const source = audioCtx.createMediaStreamSource(stream);
        const pcmNode = new AudioWorkletNode(audioCtx, "pcm-processor");
        pcmNode.port.onmessage = (event) => {
          const floatFrame = event.data; // Float32Array
          console.log(`[Audio] Received frame (${floatFrame.length} samples)`);

          // Apply RNNoise
          let denoisedFrame = floatFrame;
          if (rnRef.current) {
            denoisedFrame = rnRef.current.process(denoisedFrame);
          }

          // Voice Activity Detection
          const { vadInstance, VADModule } = vadRef.current;
          const intFrame = VADModule.VAD.floatTo16BitPCM(denoisedFrame);
          const vadResult = vadInstance.processBuffer(intFrame);
          const now = Date.now();

          if (vadResult === VADModule.VADEvent.VOICE) {
            console.log("[VAD] Voice detected");
            lastVoiceTimeRef.current = now;
            // Append to buffer
            const oldBuffer = bufferRef.current;
            bufferRef.current = new Int16Array(
              oldBuffer.length + intFrame.length
            );
            bufferRef.current.set(oldBuffer, 0);
            bufferRef.current.set(intFrame, oldBuffer.length);
          } else {
            console.log("[VAD] Silence");
            // If silence lasted >300ms, finalize utterance
            if (now - lastVoiceTimeRef.current > 300) {
              if (bufferRef.current.length > 0) {
                console.log(
                  "[Speech] End of speech detected, sending chunk..."
                );
                setIsThinking(true);
                // Send PCM to backend
                ws.send(bufferRef.current.buffer);
                console.log(
                  "[WebSocket] Sent PCM buffer of",
                  bufferRef.current.byteLength,
                  "bytes"
                );
                bufferRef.current = new Int16Array();
              }
            }
          }
        };

        source.connect(pcmNode).connect(audioCtx.destination);
        console.log("[Audio] Audio processing started");
      } catch (err) {
        console.error("[Audio] Error accessing microphone:", err);
        setIsListening(false);
      }
    }

    startStreaming();

    return () => {
      // Cleanup on unmount
      if (contextRef.current) {
        contextRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      setIsListening(false);
    };
  }, [
    setIsListening,
    setIsThinking,
    addFinalTranscript,
    updatePartialTranscript,
  ]);

  return null; // hook does not render
}
