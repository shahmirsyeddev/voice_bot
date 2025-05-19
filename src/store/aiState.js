// frontend/store/aiState.js
import { create } from "zustand";

export const useAIStore = create((set) => ({
  // AI interaction states
  isListening: false,
  isThinking: false,
  // We might have an 'isResponding' or similar, but we'll infer responding from audio playback
  transcript: "", // live transcript for current user utterance
  conversation: [], // array of { speaker: 'user'|'assistant', text: string }

  // Actions to update state
  setAIState: (key, value) => set({ [key]: value }),
  setTranscript: (text) => set({ transcript: text }),
  addMessage: (speaker, text) =>
    set((state) => ({
      conversation: [...state.conversation, { speaker, text }],
    })),
  resetConversation: () => set({ conversation: [] }),
}));
