import { api } from "../api";
import { store } from "./store";

export const markdown = store.createEffect(async (state, noteId: string) => {
  const note = state.notes.notes.find((n) => n.noteId === noteId);
  if (note) {
    const { content, title } = note;
    const result = await api.exportNote.markdown(state.auth.session, {
      content,
      title,
    } as any); // TODO: improve type of NoteDTO to include new schema types from export service
    result.map((response) => {
      window.open(response.src, "_blank");
    });
  }
});

export const html = store.createEffect(async (state, noteId: string) => {
  const note = state.notes.notes.find((n) => n.noteId === noteId);
  if (note) {
    const { content, title } = note;
    const result = await api.exportNote.html(state.auth.session, {
      content,
      title,
    } as any); // TODO: improve type of NoteDTO to include new schema types from export service
    result.map((response) => {
      window.open(response.src, "_blank");
    });
  }
});
