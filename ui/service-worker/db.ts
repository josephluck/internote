import Dexie from "dexie";
import { GetNoteDTO } from "@internote/notes-service/types";

class NotesDatabase extends Dexie {
  public notes: Dexie.Table<GetNoteDTO, string>;

  constructor() {
    super("NotesDatabase");
    this.version(1).stores({
      notes: "&noteId, userId, title, content, *tags, dateUpdated, dateCreated"
    });
    this.notes = this.table("notes");
  }
}

export const notesDb = new NotesDatabase();
