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
        overwriteCount={store.state.rest.overwriteCount}
        initialValue={note.content}
        onChange={changes =>
          store.actions.rest.updateNote({
            noteId: note.id,
            ...changes
          })
        }
        onSaveTag={changes =>
          store.actions.rest.saveNewTag({
            noteId: note.id,
            ...changes
          })
        }
        onDelete={() =>
          store.actions.rest.deleteNoteConfirmation({
            noteId: note.id
          })
        }
        saving={store.state.rest.loading.updateNote}
        distractionFree={store.state.rest.distractionFree}
        speechSrc={store.state.speech.speechSrc}
        isSpeechLoading={store.state.speech.loading.requestSpeech}
        onRequestSpeech={content =>
          store.actions.speech.requestSpeech({ content, noteId: note.id })
        }
        onDiscardSpeech={() => store.actions.speech.setSpeechSrc(null)}
        isDictionaryShowing={store.state.rest.dictionaryShowing}
        isDictionaryLoading={store.state.rest.loading.requestDictionary}
        closeDictionary={() => store.actions.rest.setDictionaryShowing(false)}
        onRequestDictionary={store.actions.rest.requestDictionary}
        dictionaryResults={store.state.rest.dictionaryResults}
        outlineShowing={store.state.rest.outlineShowing}
        toggleOutlineShowing={store.actions.rest.setOutlineShowing}
        tags={store.state.rest.tags}
        newTagSaving={store.state.rest.loading.saveNewTag}
      />
    </>
  );
}
