import React from "react";
import Head from "next/head";
import { GetNoteDTO } from "@internote/notes-service/types";
import dynamic from "next/dynamic";

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
    <Editor initialValue={initialValue} />
  </>
);

const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text:
          ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    children: [{ text: "Try it out for yourself!" }],
  },
];
