import { GetNoteDTO } from "@internote/notes-service/types";

type NotesState = {
  notes: GetNoteDTO[];
};

export const notesInitialState: NotesState = {
  notes: [],
};
