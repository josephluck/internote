import {
  CreateSnippetDTO,
  GetSnippetDTO,
} from "@internote/snippets-service/types";

import { api } from "../../api";
import { store } from "../store";
import { snippetsInitialState } from "./state";

export const resetState = store.createMutator(
  (state) => (state.snippets = snippetsInitialState)
);

export const setSnippets = store.createMutator(
  (state, snippets: GetSnippetDTO[]) => (state.snippets.snippets = snippets)
);

export const createSnippet = store.createEffect(
  async (state, snippet: CreateSnippetDTO) => {
    const response = await api.snippets.create(state.auth.session, snippet);
    response.map((s) => setSnippets([s, ...state.snippets.snippets]));
  }
);

export const fetchSnippets = store.createEffect(async (state) => {
  const response = await api.snippets.list(state.auth.session);
  response.map(setSnippets);
});

export const deleteSnippet = store.createEffect(async (state, snippetId) => {
  const response = await api.snippets.delete(state.auth.session, snippetId);
  response.map(() =>
    setSnippets(
      state.snippets.snippets.filter((s) => s.snippetId !== snippetId)
    )
  );
});
