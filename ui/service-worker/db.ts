import Dexie from "dexie";
import { GetNoteDTO, UpdateNoteDTO } from "@internote/notes-service/types";

/**
 * Used by the sync mechanism to determine which
 * API call to make for the note.
 */
export type NoteIndexState = "CREATE" | "UPDATE" | "DELETE";

/**
 * Represents a note DTO that is cached in IndexDB
 * NB: the userId property is sometimes stored here
 * but the server never relies on it since the API
 * overrides the userId from the incoming request.
 */
export interface NoteIndex extends GetNoteDTO {
  /**
   * Used to determine whether the note has
   * been saved on the server or not.
   * When a request comes in to add or update a note,
   * the synched property will be set to false.
   * When the service worker processes the IndexDB cache,
   * the synced property will be set to true.
   */
  synced: boolean;
  /**
   * Used by the sync mechanism to determine which
   * API call to make for the note.
   */
  state: NoteIndexState;
}

class NotesIndex extends Dexie {
  public notes: Dexie.Table<NoteIndex, string>;

  constructor() {
    super("NotesDatabase");
    this.version(1).stores({
      notes:
        "&noteId, userId, title, content, *tags, dateUpdated, dateCreated, synched"
    });
    this.notes = this.table("notes");
  }
}

/**
 * Prepares an incoming note add or update for storage
 * in the IndexDB cache.
 *
 * Set synched to false if the note should be synched to
 * the server using background-sync.
 */
export const marshallNoteToNoteIndex = (
  body: UpdateNoteDTO,
  state: NoteIndexState,
  synced: boolean = false
): NoteIndex => ({
  noteId: body.noteId,
  userId: body.userId,
  title: body.title,
  content: body.content,
  tags: [...new Set(body.tags)],
  dateUpdated: body.dateUpdated,
  state,
  synced
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
