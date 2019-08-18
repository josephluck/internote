import uuid from "uuid";
import { UpdateNoteDTO, GetNoteDTO } from "@internote/notes-service/types";
import {
  NoteIndex,
  marshallNoteToNoteIndex,
  unmarshallNoteIndexToNote,
  NotesDbInterface,
  AuthDbInterface
} from "./db";
import { Api } from "../api/api";
import { defaultNote } from "@internote/notes-service/db/default-note";

export function makeServiceWorkerApi(
  authDb: AuthDbInterface,
  notesDb: NotesDbInterface,
  api: Api
) {
  /**
   * Returns the list of notes in the index.
   *
   * NB: does not filter for notes who's state is DELETE,
   * this should be done at the handler level.
   */
  const listNotesFromIndex = async (): Promise<NoteIndex[]> => {
    return await notesDb.getAll();
  };

  /**
   * Creates a new note in the index.
   * NB: assumes the user is creating a brand new note.
   */
  const createNewNoteInIndex = async (
    body: UpdateNoteDTO
  ): Promise<NoteIndex> => {
    const updates = marshallNoteToNoteIndex(
      { ...defaultNote, ...body },
      {
        state: "UPDATE",
        createOnServer: true,
        synced: false
      }
    );
    const noteId = await notesDb.add({ ...updates, noteId: uuid() });
    return await notesDb.get(noteId);
  };

  /**
   * Updates a note in the index.
   * NB: creates a note in the index if a note is not found. This happens
   * in edge cases where the index has not been filled with a GET to /notes.
   * Ensure that the same noteId is used so that updating notes that are
   * not yet in the index are persisted with the same noteId as on the
   * server so that when syncing, the PUT request works as expected.
   * TODO: this won't work if the user creates a note in the interface
   * (this creates a temporary UUID in the service worker), then syncs
   * (this creates the final UUID on the server) as there are now two
   * UUIDs for the same note without any way of marrying them up.
   */
  const updateNoteInIndex = async (
    noteId: string,
    body: UpdateNoteDTO
  ): Promise<NoteIndex> => {
    const note = await notesDb.get(noteId);
    if (note) {
      const updates = marshallNoteToNoteIndex(body, {
        state: "UPDATE",
        createOnServer: note.createOnServer || false,
        synced: false
      });
      await notesDb.update(noteId, {
        ...note,
        ...updates
      });
    } else {
      const updates = marshallNoteToNoteIndex(body, {
        state: "UPDATE",
        createOnServer: true,
        synced: false
      });
      await notesDb.add({
        ...note,
        ...updates,
        noteId
      });
    }
    return await notesDb.get(noteId);
  };

  /**
   * Marks the note as deleted from the index.
   * This will be synced via a DELETE request when the notes
   * are synced later.
   */
  const setNoteToDeletedInIndex = async (
    noteId: string
  ): Promise<NoteIndex> => {
    const note = await notesDb.get(noteId);
    if (note) {
      await notesDb.update(note.noteId, {
        ...note,
        state: "DELETE",
        createOnServer: false,
        synced: false
      });
      return notesDb.get(noteId);
    }
  };

  /**
   * Returns a list of notes in the index that are pending to be
   * synced with the server.
   */
  const getNotesToSync = async (): Promise<NoteIndex[]> => {
    return await notesDb.getUnsynced();
  };

  /**
   * Replaces a note in the index with a note stored in the server.
   *
   * This takes the noteIndexId which can be different if
   * a note was created rather than updated, because we assign a
   * temporary uuid to the note when it's in a pending creation state
   * and when it has been created, we receive the _actual_ noteId from
   * the server, and that is what we should store.
   *
   * This is also wrapped in a try / finally just in case there are new
   * server notes that are not in the index (they should be added to the
   * index anyway).
   */
  const replaceNoteInIndexWithServerNote = async (
    noteIndexId: string,
    serverNote: GetNoteDTO
  ): Promise<NoteIndex> => {
    try {
      await removeNoteFromIndex(noteIndexId);
    } finally {
      await notesDb.add(
        marshallNoteToNoteIndex(serverNote, {
          synced: true,
          state: "UPDATE",
          createOnServer: false
        })
      );
    }
    return await notesDb.get(noteIndexId);
  };

  /**
   * Removes a note from the index.
   */
  const removeNoteFromIndex = async (noteId: string): Promise<void> => {
    return await notesDb.remove(noteId);
  };

  /**
   * Iterates through all the notes in the IndexDB and
   * issues appropriate requests depending on the state
   * of the note in the index.
   */
  const syncNotesFromIndexToServer = async () => {
    const session = await authDb.get();

    if (session) {
      const noteIndexesToSync = await getNotesToSync();
      const noteIndexesToCreate = noteIndexesToSync.filter(
        note => note.createOnServer === true && note.state !== "DELETE"
      );
      const noteIndexesToUpdate = noteIndexesToSync.filter(
        note => note.createOnServer === false && note.state === "UPDATE"
      );
      const noteIndexesToDelete = noteIndexesToSync.filter(
        note => note.createOnServer === false && note.state === "DELETE"
      );
      console.log(`[SW] [SYNC] starting sync.`, {
        "Notes to sync": noteIndexesToSync.length,
        "Notes to create": noteIndexesToCreate.length,
        "Notes to update": noteIndexesToUpdate.length,
        "Notes to delete": noteIndexesToDelete.length
      });

      const createRequests = noteIndexesToCreate.map(async noteIndex => {
        const update = unmarshallNoteIndexToNote(noteIndex);
        const result = await api.notes.create(session, {
          title: update.title,
          content: update.content,
          tags: update.tags
        });
        return await result.fold(
          async () => {
            console.log(`[SW] [SYNC] failed to create note ${update.title}`);
            return await removeNoteFromIndex(noteIndex.noteId);
          },
          async serverNote => {
            return await replaceNoteInIndexWithServerNote(
              noteIndex.noteId,
              serverNote
            );
          }
        );
      });

      const updateRequests = noteIndexesToUpdate.map(async noteIndex => {
        const update = unmarshallNoteIndexToNote(noteIndex);
        const result = await api.notes.update(session, update.noteId, {
          title: update.title,
          content: update.content,
          tags: update.tags
        });
        return await result.fold(
          async () => {
            console.log(`[SW] [SYNC] failed to update note ${update.noteId}`);
            return await removeNoteFromIndex(noteIndex.noteId);
          },
          async serverNote => {
            return await replaceNoteInIndexWithServerNote(
              noteIndex.noteId,
              serverNote
            );
          }
        );
      });

      const deleteRequests = noteIndexesToDelete.map(async update => {
        const result = await api.notes.delete(session, update.noteId);
        return await result.fold(
          async () => {
            console.log(`[SW] [SYNC] failed to delete note ${update.noteId}`);
            return await removeNoteFromIndex(update.noteId);
          },
          async () => {
            return await removeNoteFromIndex(update.noteId);
          }
        );
      });

      await Promise.all(
        []
          .concat(createRequests)
          .concat(updateRequests)
          .concat(deleteRequests)
      );

      const latestNotesFromServer = await api.notes.list(session);
      await latestNotesFromServer.fold(
        () => Promise.resolve(),
        async notes => {
          return await Promise.all(
            notes.map(async note => {
              return await replaceNoteInIndexWithServerNote(note.noteId, note);
            })
          );
        }
      );

      console.log("[SW] [SYNC] finished sync.");
    }
  };

  return {
    listNotesFromIndex,
    createNewNoteInIndex,
    updateNoteInIndex,
    setNoteToDeletedInIndex,
    syncNotesFromIndexToServer
  };
}
