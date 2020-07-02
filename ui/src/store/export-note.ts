import { api } from "../api";
import { isServer } from "../utilities/window";
import { store } from "./store";

export const markdown = store.createEffect(async (state, noteId: string) => {
  const { content, title } = state.notes.notes.find((n) => n.noteId === noteId);
  const result = await api.exportNote.markdown(state.auth.session, {
    content,
    title,
  } as any); // TODO: improve type of NoteDTO to include new schema types from export service
  result.map((response) => {
    if (!isServer()) {
      window.open(response.src, "_blank");
    }
  });
});

export const html = store.createEffect(async (state, noteId: string) => {
  const { content, title } = state.notes.notes.find((n) => n.noteId === noteId);
  const result = await api.exportNote.html(state.auth.session, {
    content,
    title,
  } as any); // TODO: improve type of NoteDTO to include new schema types from export service
  result.map((response) => {
    if (!isServer()) {
      window.open(response.src, "_blank");
    }
  });
});
