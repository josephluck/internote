import uuid from "uuid";
import { UpdateNoteDTO, GetNoteDTO } from "@internote/notes-service/types";
import {
  notesIndex,
  NoteIndex,
  marshallNoteToNoteIndex,
  unmarshallNoteIndexToNote,
  NoteIndexState
} from "./db";

export const listNotes = async (): Promise<GetNoteDTO[]> => {
  const notes = await notesIndex.notes.toArray();
  return notes.map(unmarshallNoteIndexToNote);
};

/**
 * Creates a new note in the index.
 * NB: assumes the user is creating a brand new note.
 */
export const createNote = async (body: UpdateNoteDTO) =>
  addNote(body, "CREATE");

/**
 * Adds a note to the index.
 * NB: doesn't assume that the user is creating a new note.
 * The note could simply not be in the index yet.
 */
export const addNote = async (
  body: UpdateNoteDTO,
  state: NoteIndexState = "CREATE"
): Promise<NoteIndex> => {
  const updates = marshallNoteToNoteIndex(body, state);
  const noteId = await notesIndex.notes.add({
    noteId: uuid(),
    ...updates,
    dateCreated: Date.now(),
    synced: false
  });
  return await notesIndex.notes.get(noteId);
};

/**
 * Updates a note in the index
 */
export const updateNote = async (
  noteId: string,
  body: UpdateNoteDTO
): Promise<NoteIndex> => {
  const note = await notesIndex.notes.get(noteId);
  const updates = marshallNoteToNoteIndex(body, "UPDATE");
  if (note) {
    await notesIndex.notes.update(noteId, {
      ...note,
      ...updates,
      dateUpdated: Date.now(),
      synced: false
    });
  } else {
    // NB: if not found in the index, add a new note to the index
    // this doesn't necessarily mean that the note doesn't exist on
    // the server, so still store the state as 'UPDATE'.
    await addNote(body, "UPDATE");
  }
  return await notesIndex.notes.get(noteId);
};

/**
 * Deletes the note from the index
 */
export const deleteNote = async (
  noteId: string,
  body: UpdateNoteDTO
): Promise<NoteIndex> => {
  const note = await notesIndex.notes.get(noteId);
  if (note) {
    await notesIndex.notes.update(note.noteId, {
      ...note,
      state: "DELETED",
      synced: false
    });
    return notesIndex.notes.get(noteId);
  } else {
    return await addNote(body, "DELETE");
  }
};
