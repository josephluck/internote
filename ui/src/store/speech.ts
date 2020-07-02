import { api } from "../api";
import { store } from "./store";

type SpeechState = {
  speechSrc: string | null;
};

export const speechInitialState: SpeechState = {
  speechSrc: null,
};

export const resetState = store.createMutator(
  (state) => (state.speech = speechInitialState)
);

export const setSpeechSrc = store.createMutator(
  (state, src: string | null) => (state.speech.speechSrc = src)
);

export const requestSpeech = store.createEffect(
  async (state, { words, id }: { words: string; id: string }) => {
    const result = await api.speech.create(state.auth.session, {
      id,
      words,
      voice: state.preferences.voice || "Male",
    });
    result.map(async (response) => {
      const src = await api.attachments.makePresignedUrl(
        state.auth.session,
        response.key
      );
      setSpeechSrc(src);
    });
  }
);
