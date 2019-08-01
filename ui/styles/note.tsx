import * as React from "react";
import Head from "next/head";
import { InternoteEditor } from "./editor";
import { GetNoteDTO } from "@internote/notes-service/types";

export function Note({ note }: { note: GetNoteDTO }) {
  return (
    <>
      <Head>
        <title>{note.title} - Internote</title>
      </Head>
      <InternoteEditor id={note.noteId} initialValue={note.content} />
    </>
  );
}
