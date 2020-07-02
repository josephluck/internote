import { DictionaryResult } from "@internote/dictionary-service/types";

import { api } from "../api";
import { store } from "./store";

type DictionaryState = {
  dictionaryShowing?: boolean;
  dictionaryResults: DictionaryResult[];
};

export const dictionaryInitialState: DictionaryState = {
  dictionaryShowing: false,
  dictionaryResults: [],
};

export const resetState = store.createMutator(
  (state) => (state.dictionary = dictionaryInitialState)
);

export const setDictionaryResults = store.createMutator(
  (state, results: DictionaryResult[]) =>
    (state.dictionary.dictionaryResults = results)
);

export const setDictionaryShowing = store.createMutator(
  (state, showing?: boolean) => (state.dictionary.dictionaryShowing = showing)
);

export const lookup = store.createEffect(async (state, word: string) => {
  setDictionaryShowing(true);
  const response = await api.dictionary.lookup(state.auth.session, {
    word,
  });
  response.map(({ results }) => setDictionaryResults(results));
});
