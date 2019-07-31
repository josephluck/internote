import { Note } from "./db/models";

/**
 * Represents the DTO for a note.
 *
 * NB: needed since the note content is compressed
 * in the database, but not over the API.
 */
export interface NoteDTO extends Omit<Note, "content"> {
  content: {};
}
