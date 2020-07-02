import stately from "@josephluck/stately";
import makeUseStately from "@josephluck/stately/src/hooks";
import { useState } from "react";

import { authInitialState } from "./auth";
import { dictionaryInitialState } from "./dictionary";
import { notesInitialState } from "./notes";
import { preferencesInitialState } from "./preferences";
import { snippetsInitialState } from "./snippets";
import { speechInitialState } from "./speech";
import { tagsInitialState } from "./tags";
import { uiInitialState } from "./ui";

const initialState = {
  auth: authInitialState,
  ui: uiInitialState,
  dictionary: dictionaryInitialState,
  notes: notesInitialState,
  preferences: preferencesInitialState,
  snippets: snippetsInitialState,
  speech: speechInitialState,
  tags: tagsInitialState,
};

export type State = typeof initialState;

export const store = stately(initialState);
export const useStately = makeUseStately(store);

export const useLoadingAction = <Fn extends (...args: any[]) => Promise<any>>(
  fn: Fn
): { exec: Fn; loading: boolean } => {
  const [loading, setLoading] = useState(false);

  const exec = (...args: any[]) => {
    try {
      setLoading(true);
      return fn(...args);
    } finally {
      setLoading(false);
    }
  };

  return {
    exec: (exec as any) as Fn,
    loading,
  };
};
