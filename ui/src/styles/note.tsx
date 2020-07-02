import { EMPTY_SCHEMA } from "@internote/lib/schema-examples";
import { GetNoteDTO } from "@internote/notes-service/types";
import React from "react";

import { InternoteEditor } from "./editor/internote-editor";

export const Note: React.FunctionComponent<{ note: GetNoteDTO }> = ({
  note,
}) => (
  <>
    <InternoteEditor
      initialValue={Array.isArray(note.content) ? note.content : EMPTY_SCHEMA}
      noteId={note.noteId}
    />
  </>
);
