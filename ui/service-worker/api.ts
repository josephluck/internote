import uuid from "uuid";
import { UpdateNoteDTO, GetNoteDTO } from "@internote/notes-service/types";
import {
  notesIndex,
  NoteIndex,
  marshallNoteToNoteIndex,
  NoteIndexState
} from "./db";

/**
 *
 */
export const listNotes = async (): Promise<NoteIndex[]> => {
  return await notesIndex.notes.toArray();
};

/**
 * Creates a new note in the index.
 * NB: assumes the user is creating a brand new note.
 */
export const createNote = async (body: UpdateNoteDTO): Promise<NoteIndex> =>
  addNoteToIndex(body, "UPDATE", true);

/**
 * Updates a note in the index.
 * NB: creates a note in the index if a note is
 * not found. This happens in edge cases where the
 * index has not been filled with a GET to /notes
 */
export const updateNoteInIndex = async (
  noteId: string,
  body: UpdateNoteDTO
): Promise<NoteIndex> => {
  const note = await notesIndex.notes.get(noteId);
  const updates = marshallNoteToNoteIndex(body, "UPDATE", false, false);
  if (note) {
    await notesIndex.notes.update(noteId, {
      ...note,
      ...updates,
      dateUpdated: Date.now(),
      synced: false
    });
  } else {
    // TODO: createOnServer might need to be set to true?
    await addNoteToIndex(body, "UPDATE", false);
  }
  return await notesIndex.notes.get(noteId);
};

/**
 * Marks the note as deleted from the index
 */
export const deleteNoteInIndex = async (noteId: string): Promise<NoteIndex> => {
  const note = await notesIndex.notes.get(noteId);
  if (note) {
    await notesIndex.notes.update(note.noteId, {
      ...note,
      state: "DELETE",
      synced: false
    });
    return notesIndex.notes.get(noteId);
  }
};

/**
 * Adds a note to the index.
 */
export const addNoteToIndex = async (
  body: UpdateNoteDTO,
  state: NoteIndexState,
  createOnServer: boolean
): Promise<NoteIndex> => {
  const updates = marshallNoteToNoteIndex(body, state, createOnServer, false);
  const noteId = await notesIndex.notes.add({
    noteId: uuid(),
    ...updates,
    dateCreated: createOnServer ? Date.now() : updates.dateCreated,
    synced: false
  });
  return await notesIndex.notes.get(noteId);
};

/**
 * Returns a list of notes in the index that are pending to be
 * synced with the server.
 */
export const getNotesToSync = async (
  filter: (note: NoteIndex) => boolean
): Promise<NoteIndex[]> => {
  return notesIndex.notes.filter(n => !n.synced && filter(n)).toArray();
};

/**
 * Replaces a note in the index with a note stored in the server.
 *
 * This takes the noteIndexId which can be different if
 * a note was created rather than updated, because we assign a
 * temporary uuid to the note when it's in a pending creation state.
 */
export const replaceNoteInIndexWithServerNote = async (
  noteIndexId: string,
  serverNote: GetNoteDTO
): Promise<NoteIndex> => {
  await removeNoteFromIndex(noteIndexId);
  await addNoteToIndex(serverNote, "UPDATE", false);
  return await markNoteIndexAsSynced(serverNote.noteId);
};

/**
 * Marks the given note in the index as synced.
 */
export const markNoteIndexAsSynced = async (
  noteId: string
): Promise<NoteIndex> => {
  await notesIndex.notes.update(noteId, { synced: true });
  return await notesIndex.notes.get(noteId);
};

/**
 * Removes a note from the index.
 */
export const removeNoteFromIndex = async (noteId: string): Promise<void> => {
  await notesIndex.notes.delete(noteId);
};
