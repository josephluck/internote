import * as React from "react";
import Head from "next/head";
import * as Types from "@internote/api/domains/types";
import { InternoteEditor } from "./editor";

export function Note({ note }: { note: Types.Note }) {
  return (
    <>
      <Head>
        <title>{note.title} - Internote</title>
      </Head>
      <InternoteEditor id={note.id} initialValue={note.content} />
    </>
  );
}
