import { InternoteEditorValue } from "@internote/lib/editor-types";

import { Note } from "./models";

/**
 * Represents the update note DTO.
 *
 * NB: needed since the note content is compressed
 * in the database, but not over the API.
 */
export interface UpdateNoteDTO extends Omit<Note, "content" | "dateCreated"> {
  /**
   * Pass the last date updated to determine whether there
   * is a newer note saved. Used to avoid conflicts.
   */
  dateUpdated?: number;
  content: InternoteEditorValue;
}

/**
 * Represents the get note DTO.
 *
 * NB: needed since the note content is compressed
 * in the database, but not over the API.
 */
export interface GetNoteDTO extends Omit<Note, "content"> {
  content: InternoteEditorValue;
}

/**
 * Represents the create note DTO.
 *
 * NB: new notes requests don't have any properties
 */
export interface CreateNoteDTO
  extends Omit<Note, "noteId" | "userId" | "content"> {
  content: InternoteEditorValue;
}
