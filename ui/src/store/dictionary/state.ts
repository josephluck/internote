import { DictionaryResult } from "@internote/dictionary-service/types";

export type DictionaryState = {
  dictionaryShowing?: boolean;
  dictionaryResults: DictionaryResult[];
};

export const dictionaryInitialState: DictionaryState = {
  dictionaryShowing: false,
  dictionaryResults: [],
};
