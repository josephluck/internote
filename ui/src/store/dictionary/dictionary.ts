import { DictionaryResult } from "@internote/dictionary-service/types";

import { api } from "../../api";
import { store } from "../store";
import { dictionaryInitialState } from "./state";

export const resetState = store.createMutator(
  (state) => (state.dictionary = dictionaryInitialState)
);

export const setDictionaryLoading = store.createMutator(
  (state, loading: boolean) => (state.dictionary.loading = loading)
);

export const setDictionaryResults = store.createMutator(
  (state, results: DictionaryResult[]) => (state.dictionary.results = results)
);

export const setDictionaryShowing = store.createMutator(
  (state, showing: boolean) => (state.dictionary.showing = showing)
);

export const lookup = store.createEffect(async (state, word: string) => {
  try {
    setDictionaryLoading(true);
    setDictionaryShowing(true);
    const response = await api.dictionary.lookup(state.auth.session, {
      word,
    });
    response.map(({ results }) => setDictionaryResults(results));
  } finally {
    setDictionaryLoading(false);
  }
});
