import { api } from "../../api";
import { UpdateNotePayload, updateNote } from "../notes/notes";
import { store } from "../store";
import { tagsInitialState } from "./state";

export const resetState = store.createMutator(
  (state) => (state.tags = tagsInitialState)
);

export const setTags = store.createMutator(
  (state, tags: string[]) => (state.tags.tags = tags)
);

export const fetchTags = store.createEffect(async (state) => {
  const response = await api.tags.list(state.auth.session);
  response.map(setTags);
});

export const saveNewTag = store.createEffect(
  async (_state, payload: UpdateNotePayload) => {
    await updateNote(payload);
  }
);
