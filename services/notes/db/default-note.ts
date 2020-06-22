import { EMPTY_SCHEMA } from "@internote/lib/schema-examples";

import { GetNoteDTO } from "../types";

export const defaultNote: GetNoteDTO = {
  noteId: "",
  userId: "",
  content: EMPTY_SCHEMA,
  title: "Welcome 👋",
  tags: [],
};
