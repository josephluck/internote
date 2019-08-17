import uuid from "uuid";
import { UpdateNoteDTO, GetNoteDTO } from "@internote/notes-service/types";
import {
  notesIndex,
  NoteIndex,
  marshallNoteToNoteIndex,
  NoteIndexState,
  unmarshallNoteIndexToNote
} from "./db";
import { makeApi } from "../api/api";
import { env } from "../env";
import { swLog } from ".";

/**
 * Returns the list of notes in the index.
 *
 * NB: does not filter for notes who's state is DELETE,
 * this should be done at the handler level.
 */
export const listNotes = async (): Promise<NoteIndex[]> => {
  return await notesIndex.notes.toArray();
};

/**
 * Creates a new note in the index.
 * NB: assumes the user is creating a brand new note.
 */
export const createNewNoteInIndex = async (
  body: UpdateNoteDTO
): Promise<NoteIndex> => {
  const updates = marshallNoteToNoteIndex(body, {
    state: "UPDATE",
    createOnServer: true,
    synced: false
  });
  const noteId = await notesIndex.notes.add({ noteId: uuid(), ...updates });
  return await notesIndex.notes.get(noteId);
};

/**
 * Updates a note in the index.
 * NB: creates a note in the index if a note is not found. This happens
 * in edge cases where the index has not been filled with a GET to /notes.
 * Ensure that the same noteId is used so that updating notes that are
 * not yet in the index are persisted with the same noteId as on the
 * server so that when syncing, the PUT request works as expected.
 */
export const updateNoteInIndex = async (
  noteId: string,
  body: UpdateNoteDTO
): Promise<NoteIndex> => {
  const note = await notesIndex.notes.get(noteId);
  if (note) {
    const updates = marshallNoteToNoteIndex(body, {
      state: "UPDATE",
      createOnServer: false,
      synced: false
    });
    await notesIndex.notes.update(noteId, {
      ...note,
      ...updates
    });
  } else {
    const updates = marshallNoteToNoteIndex(body, {
      state: "UPDATE",
      createOnServer: true,
      synced: false
    });
    await notesIndex.notes.add({
      ...note,
      ...updates,
      noteId
    });
  }
  return await notesIndex.notes.get(noteId);
};

/**
 * Marks the note as deleted from the index.
 * This will be synced via a DELETE request when the notes
 * are synced later.
 */
export const setNoteToDeletedInIndex = async (
  noteId: string
): Promise<NoteIndex> => {
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
  const updates = marshallNoteToNoteIndex(body, {
    state,
    createOnServer,
    synced: false
  });
  const noteId = await notesIndex.notes.add({
    noteId: uuid(),
    ...updates,
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
 * temporary uuid to the note when it's in a pending creation state
 * and when it has been created, we receive the _actual_ noteId from
 * the server, and that is what we should store.
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

/**
 * Iterates through all the notes in the IndexDB and
 * issues appropriate requests depending on the state
 * of the note in the index.
 */
export const syncNotesToServer = async () => {
  // TODO: env might need to be done through webpack at build time?
  const api = makeApi({
    host: env.SERVICES_HOST,
    region: env.SERVICES_REGION
  });

  const session = {} as any; // TODO: get session from IndexDB

  const noteIndexesToCreate = await getNotesToSync(
    note => note.createOnServer && note.state !== "DELETE"
  );
  await Promise.all(
    noteIndexesToCreate.map(async noteIndex => {
      swLog(`[SYNC] creating note ${noteIndex.title}`);
      const update = unmarshallNoteIndexToNote(noteIndex);
      const result = await api.notes.create(session, {
        title: update.title,
        content: update.content,
        tags: update.tags
      });
      return await result.fold(
        () => Promise.resolve(),
        async serverNote =>
          await replaceNoteInIndexWithServerNote(noteIndex.noteId, serverNote)
      );
    })
  );

  const noteIndexesToUpdate = await getNotesToSync(
    note => !note.createOnServer && note.state === "UPDATE"
  );
  await Promise.all(
    noteIndexesToUpdate.map(async noteIndex => {
      swLog(`[SYNC] updating note ${noteIndex.title}`);
      const update = unmarshallNoteIndexToNote(noteIndex);
      const result = await api.notes.update(session, update.noteId, {
        title: update.title,
        content: update.content,
        tags: update.tags
      });
      return result.fold(
        () => Promise.resolve(),
        async serverNote =>
          await replaceNoteInIndexWithServerNote(noteIndex.noteId, serverNote)
      );
    })
  );

  const noteIndexesToDelete = await getNotesToSync(
    note => !note.createOnServer && note.state === "DELETE"
  );
  await Promise.all(
    noteIndexesToDelete.map(async noteIndex => {
      swLog(`[SYNC] deleting note ${noteIndex.title}`);
      await api.notes.delete(session, noteIndex.noteId);
      await removeNoteFromIndex(noteIndex.noteId);
    })
  );
};
