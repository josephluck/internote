import { InternoteEditorValue } from "@internote/lib/editor-types";
import { EMPTY_SCHEMA } from "@internote/lib/schema-examples";
import { GetNoteDTO } from "@internote/notes-service/types";
import { navigate } from "@reach/router";
import { Option } from "space-lift";

import { api } from "../../api";
import { store } from "../store";
import { fetchTags } from "../tags/tags";
import { notesInitialState } from "./state";

export const resetState = store.createMutator(
  (state) => (state.notes = notesInitialState)
);

export const setNotes = store.createMutator(
  (state, notes: GetNoteDTO[]) => (state.notes.notes = notes)
);

export const fetchNotes = store.createEffect(async (state) => {
  const response = await api.notes.list(state.auth.session);
  return response.fold(
    () => [],
    (notes) => {
      setNotes(notes);
      return notes;
    }
  );
});

export const createNote = store.createEffect(async (state) => {
  const result = await api.notes.create(state.auth.session, {
    title: `New note - ${new Date().toDateString()}`,
    content: EMPTY_SCHEMA,
  });
  result.map((note) => {
    setNotes([note, ...state.notes.notes]);
    return navigate(`/?id=${note.noteId}`);
  });
});

export interface UpdateNotePayload {
  noteId: string;
  content: InternoteEditorValue;
  tags: string[];
  title: string | undefined;
}

export const updateNote = store.createEffect(
  async (state, { noteId, content, title, tags }: UpdateNotePayload) => {
    return Option(
      state.notes.notes.find((note) => note.noteId === noteId)
    ).fold(
      () => Promise.resolve(),
      async (existingNote) => {
        const savedNote = await api.notes.update(state.auth.session, noteId, {
          content,
          title,
          dateUpdated: existingNote.dateUpdated,
          tags,
        });
        await savedNote.fold(
          () => {},
          async (updatedNote) => {
            setNotes(
              state.notes.notes.map((n) =>
                n.noteId === updatedNote.noteId ? updatedNote : n
              )
            );
            await fetchTags(); // TODO: just set the tags from the payload..
          }
        );
      }
    );
  }
);

export const deleteNote = store.createEffect(async (state, noteId: string) => {
  await api.notes.delete(state.auth.session, noteId);
  setNotes(state.notes.notes.filter((note) => note.noteId !== noteId));
});
