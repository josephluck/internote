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
        onDelete={() =>
          store.actions.notes.deleteNoteConfirmation({
            noteId: note.id
          })
        }
        saving={store.state.notes.loading.updateNote}
        distractionFree={store.state.preferences.distractionFree}
        speechSrc={store.state.speech.speechSrc}
        isSpeechLoading={store.state.speech.loading.requestSpeech}
        onRequestSpeech={content =>
          store.actions.speech.requestSpeech({ content, noteId: note.id })
        }
        onDiscardSpeech={() => store.actions.speech.setSpeechSrc(null)}
        isDictionaryShowing={store.state.dictionary.dictionaryShowing}
        isDictionaryLoading={store.state.dictionary.loading.requestDictionary}
        onCloseDictionary={() =>
          store.actions.dictionary.setDictionaryShowing(false)
        }
        onRequestDictionary={store.actions.dictionary.requestDictionary}
        dictionaryResults={store.state.dictionary.dictionaryResults}
        outlineShowing={store.state.preferences.outlineShowing}
        tags={store.state.tags.tags}
        newTagSaving={store.state.tags.loading.saveNewTag}
      />
      {/* </Flex> */}
    </>
  );
}
