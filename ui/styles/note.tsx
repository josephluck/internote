import * as React from "react";
import dynamic from "next/dynamic";
import { Store } from "../store";
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

export function Note({ store, note }: { store: Store; note: Types.Note }) {
  return (
    <>
      <Head>
        <title>{note.title} - Internote</title>
      </Head>
      <Editor
        id={note.id}
        overwriteCount={store.state.notes.overwriteCount}
        initialValue={note.content}
        onChange={changes =>
          store.actions.notes.updateNote({
            noteId: note.id,
            ...changes
          })
        }
        onCreateNewTag={changes =>
          store.actions.tags.saveNewTag({
            noteId: note.id,
            ...changes
          })
        }
        distractionFree={store.state.preferences.distractionFree}
        onRequestSpeech={content =>
          store.actions.speech.requestSpeech({ content, noteId: note.id })
        }
        isDictionaryShowing={store.state.dictionary.dictionaryShowing}
        isDictionaryLoading={store.state.dictionary.loading.requestDictionary}
        onCloseDictionary={() =>
          store.actions.dictionary.setDictionaryShowing(false)
        }
        onRequestDictionary={store.actions.dictionary.requestDictionary}
        outlineShowing={store.state.preferences.outlineShowing}
      />
    </>
  );
}
