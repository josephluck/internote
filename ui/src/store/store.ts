import stately from "@josephluck/stately";
import makeUseStately from "@josephluck/stately/src/hooks";
import { useState } from "react";

import { authInitialState } from "./auth/state";
import { dictionaryInitialState } from "./dictionary/state";
import { notesInitialState } from "./notes/state";
import { preferencesInitialState } from "./preferences/state";
import { snippetsInitialState } from "./snippets/state";
import { speechInitialState } from "./speech/state";
import { tagsInitialState } from "./tags/state";
import { uiInitialState } from "./ui/state";

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
