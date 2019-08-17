import Dexie from "dexie";
import { GetNoteDTO, UpdateNoteDTO } from "@internote/notes-service/types";

/**
 * Used by the sync mechanism to determine which
 * API call to make for the note when it is synced.
 */
export type NoteIndexState = "UPDATE" | "DELETE";

interface AdditionalNoteIndexProperties {
  /**
   * Used to determine whether the note has
   * been saved on the server or not.
   * When a request comes in to add or update a note,
   * the synced property will be set to false.
   * When the service worker processes the IndexDB cache,
   * the synced property will be set to true.
   */
  synced: boolean;
  /**
   * Used by the sync mechanism to determine which
   * API call to make for the note.
   */
  state: NoteIndexState;
  /**
   * Used by the sync mechanism to determine whether
   * it needs to create a note before updating it.
   */
  createOnServer: boolean;
}

/**
 * Represents a note DTO that is cached in IndexDB
 * NB: the userId property is sometimes stored here
 * but the server never relies on it since the API
 * overrides the userId from the incoming request.
 */
export interface NoteIndex extends GetNoteDTO, AdditionalNoteIndexProperties {}

class NotesIndex extends Dexie {
  public notes: Dexie.Table<NoteIndex, string>;

  constructor() {
    super("NotesDatabase");
    this.version(1).stores({
      notes:
        "&noteId, userId, title, content, *tags, dateUpdated, dateCreated, state, synced"
    });
    this.notes = this.table("notes");
  }
}

/**
 * Prepares an incoming note add or update for storage
 * in the IndexDB cache.
 */
export const marshallNoteToNoteIndex = (
  body: UpdateNoteDTO,
  additionalProperties: AdditionalNoteIndexProperties
): NoteIndex => ({
  noteId: body.noteId,
  userId: body.userId,
  title: body.title,
  content: body.content,
  tags: [...new Set(body.tags)],
  dateUpdated: body.dateUpdated,
  ...additionalProperties
});

/**
 * Returns notes from the IndexDB cache in to DTOs that
 * the application understands.
 */
export const unmarshallNoteIndexToNote = (
  noteIndex: NoteIndex
): GetNoteDTO => ({
  noteId: noteIndex.noteId,
  userId: noteIndex.userId,
  title: noteIndex.title,
  content: noteIndex.content,
  tags: [...new Set(noteIndex.tags)],
  dateCreated: noteIndex.dateCreated,
  dateUpdated: noteIndex.dateUpdated
});

export const notesIndex = new NotesIndex();

/**
 * Provides an interface for operating on the
 * IndexDB. Useful for simplifying the API and
 * for stubbing out the DB during testing.
 */
export function makeNotesDbInterface() {
  function getAll() {
    return notesIndex.notes.toArray();
  }

  function get(id: string) {
    return notesIndex.notes.get(id);
  }

  function add(body: NoteIndex) {
    return notesIndex.notes.add(body);
  }

  function update(id: string, body: NoteIndex) {
    return notesIndex.notes.update(id, body);
  }

  function getUnsynced(filter: (note: NoteIndex) => boolean) {
    return notesIndex.notes.filter(n => !n.synced && filter(n)).toArray();
  }

  function remove(id: string) {
    return notesIndex.notes.delete(id);
  }

  return {
    getAll,
    get,
    add,
    update,
    getUnsynced,
    remove
  };
}

export type NotesDbInterface = ReturnType<typeof makeNotesDbInterface>;
