import { useEffect } from "react";
import { useAIStore } from "../store/aiState";

export function useAudioStream(flowType) {
  useEffect(() => {
    console.log("🎬 useAudioStream initialized with flow:", flowType);
    console.log(" Web socket URL:", process.env.NEXT_PUBLIC_BACKEND_WS);

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS}/ws`);
    socket.binaryType = "arraybuffer";

    let mediaStream;
    let mediaRecorder;

    // Step 1: Setup microphone access (but DO NOT start recording yet)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("🎙️ Microphone access granted");
        mediaStream = stream;

        if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          console.warn("⚠️ Opus format not supported in this browser");
        }

        mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            e.data.arrayBuffer().then((buffer) => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(buffer);
                console.log("📤 Sent audio chunk:", buffer.byteLength, "bytes");
              } else {
                console.warn("🚫 Skipped chunk: socket not open");
              }
            });
          }
        };

        mediaRecorder.onerror = (e) => {
          console.error("❌ MediaRecorder error:", e.error);
        };

        // MediaRecorder will be started later in socket.onopen
      })
      .catch((err) => {
        console.error("❌ Failed to get microphone access:", err);
      });

    // Step 2: WebSocket events
    socket.onopen = () => {
      console.log("✅ WebSocket connected");

      const initMessage = { type: "start", flow: flowType };
      socket.send(JSON.stringify(initMessage));
      console.log("📤 Sent init message:", initMessage);

      useAIStore.getState().setAIState("isListening", true);

      // Start audio recording ONLY once socket is ready
      if (mediaRecorder && mediaRecorder.state !== "recording") {
        try {
          mediaRecorder.start(250);
          console.log("🎛️ MediaRecorder started at 250ms intervals");
        } catch (err) {
          console.error("❌ Failed to start MediaRecorder:", err);
        }
      }
    };

    socket.onmessage = (event) => {
      const data = event.data;
      if (typeof data === "string") {
        const msg = JSON.parse(data);
        console.log("📩 WS message:", msg);

        if (msg.type === "partial_transcript") {
          useAIStore.getState().setTranscript(msg.text);
          console.log("📝 Partial:", msg.text);
        } else if (msg.type === "final_transcript") {
          console.log("✅ Final transcript:", msg.text);
          useAIStore.getState().addMessage("user", msg.text);
          useAIStore.getState().setAIState("isListening", false);
          useAIStore.getState().setAIState("isThinking", true);
        } else if (msg.type === "assistant_response") {
          console.log("🤖 Assistant:", msg.text);
          useAIStore.getState().addMessage("assistant", msg.text);
          useAIStore.getState().setAIState("isThinking", false);
          if (msg.audio) {
            playAudio(msg.audio);
          }
        }
      } else {
        console.log("📥 Binary audio from backend");
        playAudio(data);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket closed");
    };

    return () => {
      console.log("🧹 Cleaning up audio stream");
      useAIStore.getState().setAIState("isListening", false);
      try {
        mediaRecorder?.stop();
        mediaStream?.getTracks().forEach((t) => t.stop());
        socket.close();
      } catch (err) {
        console.error("❌ Cleanup error:", err);
      }
    };
  }, [flowType]);
}

// 🔊 Helper: play audio base64 or ArrayBuffer
function playAudio(audioData) {
  let audioBlob;
  try {
    if (typeof audioData === "string") {
      const binary = atob(audioData);
      const buffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
      audioBlob = new Blob([buffer], { type: "audio/mp3" });
    } else {
      audioBlob = new Blob([audioData], { type: "audio/mp3" });
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio
      .play()
      .then(() => console.log("▶️ Audio playing"))
      .catch((err) => console.error("❌ Audio playback error:", err));

    audio.onended = () => {
      console.log("🔁 Audio finished, resuming listening");
      useAIStore.getState().setAIState("isListening", true);
      useAIStore.getState().setTranscript("");
    };
  } catch (err) {
    console.error("❌ playAudio() error:", err);
  }
}
