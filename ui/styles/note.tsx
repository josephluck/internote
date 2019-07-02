import * as React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import * as Types from "@internote/api/domains/types";

// TODO: only dynamically import Slate, no need to dynamically import the
// whole editor
const Editor = dynamic(
  import("../styles/editor").then(module => module.InternoteEditor),
  {
    ssr: false
  }
);

export function Note({ note }: { note: Types.Note }) {
  return (
    <>
      <Head>
        <title>{note.title} - Internote</title>
      </Head>
      <Editor id={note.id} initialValue={note.content} />
    </>
  );
}
