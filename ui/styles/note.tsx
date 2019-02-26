import * as React from "react";
import dynamic from "next/dynamic";
import { Store } from "../store";
import Head from "next/head";
import * as Types from "@internote/api/domains/types";

const InternoteEditor = dynamic(
  import("../styles/editor").then(module => module.InternoteEditor),
  {
    ssr: false
  }
);

export function Note({ store, note }: { store: Store; note: Types.Note }) {
  return (
    <>
      <Head>
        <title>{note.title} - Internote</title>
      </Head>
      <InternoteEditor
        id={note.id}
        initialValue={note.content}
        onChange={changes =>
          store.actions.updateNote({ noteId: note.id, ...changes })
        }
        onDelete={() =>
          store.actions.deleteNoteConfirmation({
            noteId: note.id
          })
        }
        saving={store.state.loading.updateNote}
        distractionFree={store.state.distractionFree}
        isFullscreen={store.state.isFullscreen}
        onToggleFullscreen={store.actions.toggleFullscreen}
      />
    </>
  );
}
