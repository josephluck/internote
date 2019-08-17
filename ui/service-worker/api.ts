import uuid from "uuid";
import { UpdateNoteDTO, GetNoteDTO } from "@internote/notes-service/types";
import {
  NoteIndex,
  marshallNoteToNoteIndex,
  NoteIndexState,
  unmarshallNoteIndexToNote,
  NotesDbInterface
} from "./db";
import { Api } from "../api/api";

export function makeServiceWorkerApi(db: NotesDbInterface, api: Api) {
  /**
   * Returns the list of notes in the index.
   *
   * NB: does not filter for notes who's state is DELETE,
   * this should be done at the handler level.
   */
  const listNotesFromIndex = async (): Promise<NoteIndex[]> => {
    return await db.getAll();
  };

  /**
   * Creates a new note in the index.
   * NB: assumes the user is creating a brand new note.
   */
  const createNewNoteInIndex = async (
    body: UpdateNoteDTO
  ): Promise<NoteIndex> => {
    const updates = marshallNoteToNoteIndex(body, {
      state: "UPDATE",
      createOnServer: true,
      synced: false
    });
    const noteId = await db.add({ noteId: uuid(), ...updates });
    return await db.get(noteId);
  };

  /**
   * Updates a note in the index.
   * NB: creates a note in the index if a note is not found. This happens
   * in edge cases where the index has not been filled with a GET to /notes.
   * Ensure that the same noteId is used so that updating notes that are
   * not yet in the index are persisted with the same noteId as on the
   * server so that when syncing, the PUT request works as expected.
   */
  const updateNoteInIndex = async (
    noteId: string,
    body: UpdateNoteDTO
  ): Promise<NoteIndex> => {
    const note = await db.get(noteId);
    if (note) {
      const updates = marshallNoteToNoteIndex(body, {
        state: "UPDATE",
        createOnServer: false,
        synced: false
      });
      await db.update(noteId, {
        ...note,
        ...updates
      });
    } else {
      const updates = marshallNoteToNoteIndex(body, {
        state: "UPDATE",
        createOnServer: true,
        synced: false
      });
      await db.add({
        ...note,
        ...updates,
        noteId
      });
    }
    return await db.get(noteId);
  };

  /**
   * Marks the note as deleted from the index.
   * This will be synced via a DELETE request when the notes
   * are synced later.
   */
  const setNoteToDeletedInIndex = async (
    noteId: string
  ): Promise<NoteIndex> => {
    const note = await db.get(noteId);
    if (note) {
      await db.update(note.noteId, {
        ...note,
        state: "DELETE",
        createOnServer: false,
        synced: false
      });
      return db.get(noteId);
    }
  };

  /**
   * Adds a note to the index.
   */
  const addNoteToIndex = async (
    body: UpdateNoteDTO,
    state: NoteIndexState,
    createOnServer: boolean
  ): Promise<NoteIndex> => {
    const updates = marshallNoteToNoteIndex(body, {
      state,
      createOnServer,
      synced: false
    });
    const noteId = await db.add({
      noteId: uuid(),
      ...updates,
      synced: false
    });
    return await db.get(noteId);
  };

  /**
   * Returns a list of notes in the index that are pending to be
   * synced with the server.
   */
  const getNotesToSync = async (
    filter: (note: NoteIndex) => boolean
  ): Promise<NoteIndex[]> => {
    return await db.getUnsynced(filter);
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
  const replaceNoteInIndexWithServerNote = async (
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
  const markNoteIndexAsSynced = async (noteId: string): Promise<NoteIndex> => {
    const note = await db.get(noteId);
    await db.update(noteId, { ...note, synced: true });
    return await db.get(noteId);
  };

  /**
   * Removes a note from the index.
   */
  const removeNoteFromIndex = async (noteId: string): Promise<void> => {
    await db.remove(noteId);
  };

  /**
   * Iterates through all the notes in the IndexDB and
   * issues appropriate requests depending on the state
   * of the note in the index.
   */
  const syncNotesFromIndexToServer = async () => {
    const session = {} as any; // TODO: get session from IndexDB

    const noteIndexesToCreate = await getNotesToSync(
      note => note.createOnServer === true && note.state !== "DELETE"
    );
    await Promise.all(
      noteIndexesToCreate.map(async noteIndex => {
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
      note => note.createOnServer === false && note.state === "UPDATE"
    );
    await Promise.all(
      noteIndexesToUpdate.map(async noteIndex => {
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
      note => note.createOnServer === false && note.state === "DELETE"
    );
    console.log({ noteIndexesToDelete });
    await Promise.all(
      noteIndexesToDelete.map(async noteIndex => {
        await api.notes.delete(session, noteIndex.noteId);
        await removeNoteFromIndex(noteIndex.noteId);
      })
    );
  };

  return {
    listNotesFromIndex,
    createNewNoteInIndex,
    updateNoteInIndex,
    setNoteToDeletedInIndex,
    syncNotesFromIndexToServer
  };
}
