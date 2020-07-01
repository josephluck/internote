import { EMPTY_SCHEMA } from "@internote/lib/schema-examples";
import { GetNoteDTO } from "@internote/notes-service/types";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const Editor = dynamic(
  async () => {
    const mod = await import("./editor/internote-editor");
    return mod.InternoteEditor;
  },
  { ssr: false }
);

export const Note: React.FunctionComponent<{ note: GetNoteDTO }> = ({
  note,
}) => (
  <>
    <Head>
      <title>{note.title} - Internote</title>
    </Head>
    <Editor
      initialValue={Array.isArray(note.content) ? note.content : EMPTY_SCHEMA}
      noteId={note.noteId}
    />
  </>
);
