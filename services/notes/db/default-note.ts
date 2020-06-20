import { GetNoteDTO } from "../types";
import { EMPTY_SCHEMA } from "@internote/lib/schema-examples";

export const defaultNote: GetNoteDTO = {
  noteId: "",
  userId: "",
  content: EMPTY_SCHEMA,
  title: "Welcome 👋",
  tags: [],
};
