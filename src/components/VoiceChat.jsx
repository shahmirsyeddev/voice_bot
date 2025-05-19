// frontend/components/VoiceChat.jsx
import { useAudioStream } from "@/hooks/audioStream";
import { useAIStore } from "@/store/aiState";
export default function VoiceChat({ flowType }) {
  // Subscribe to necessary pieces of state
  const { conversation, transcript, isListening, isThinking } = useAIStore(
    (state) => ({
      conversation: state.conversation,
      transcript: state.transcript,
      isListening: state.isListening,
      isThinking: state.isThinking,
    })
  );

  // Start the audio stream for the given questionnaire flow
  useAudioStream(flowType);

  return (
    <div className="voice-chat-container">
      <div className="chat-messages">
        {conversation.map((msg, idx) => (
          <div key={idx} className={`message ${msg.speaker}`}>
            <b>{msg.speaker === "user" ? "You: " : "Assistant: "}</b>
            <span>{msg.text}</span>
          </div>
        ))}
        {/* Live transcription (if user is speaking) */}
        {isListening && transcript && (
          <div className="message user partial">
            <b>You: </b>
            <span>{transcript}...</span>
          </div>
        )}
        {isThinking && (
          <div className="status">🤔 Assistant is thinking...</div>
        )}
      </div>
      {/* Mic status / control (if needed) */}
      <div className="controls">
        {isListening ? (
          <button className="mic-button listening">🎙️ Listening…</button>
        ) : (
          <button className="mic-button" disabled={isThinking}>
            {isThinking ? "Thinking..." : "Mic Off"}
          </button>
        )}
      </div>
    </div>
  );
}
