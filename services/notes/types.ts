import { Note } from "./db/models";

/**
 * Represents the update note DTO.
 *
 * NB: needed since the note content is compressed
 * in the database, but not over the API.
 */
export interface UpdateNoteDTO extends Omit<Note, "content"> {
  content: {};
}

/**
 * Represents the get note DTO.
 *
 * NB: needed since the note content is compressed
 * in the database, but not over the API.
 */
export interface GetNoteDTO extends Omit<Note, "content"> {
  content: {};
}

/**
 * Represents the create note DTO.
 *
 * NB: new notes requests don't have any properties
 */
export interface CreateNoteDTO {}
