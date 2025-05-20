// TranscriptDisplay.jsx
import { useAIStore } from "@/store/aiState";
import React from "react";

export default function TranscriptDisplay() {
  const { partialTranscript, conversation, isListening, isThinking } =
    useAIStore();

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-50 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Live Speech</h2>
      <p className="p-2 bg-gray-200 rounded h-12">
        {partialTranscript || (isListening ? "Listening..." : "")}
      </p>

      <h2 className="text-lg font-semibold mt-4 mb-2">Conversation</h2>
      <ul className="space-y-2">
        {conversation.map((msg, i) => (
          <li key={i} className="p-2 bg-gray-100 rounded">
            {msg}
          </li>
        ))}
      </ul>

      {isThinking && (
        <div className="mt-4 p-2 bg-yellow-100 rounded">Thinking...</div>
      )}
    </div>
  );
}
