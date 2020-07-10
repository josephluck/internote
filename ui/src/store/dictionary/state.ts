import { DictionaryResult } from "@internote/dictionary-service/types";

export type DictionaryState = {
  showing: boolean;
  loading: boolean;
  results: DictionaryResult[];
};

export const dictionaryInitialState: DictionaryState = {
  showing: false,
  loading: false,
  results: [],
};
