import * as React from "react";
import dynamic from "next/dynamic";
import { Editor } from "draft-js";
import { Store } from "../store";
import { Box } from "grid-styled";
import { spacing } from "./theme";

const InternoteEditor = dynamic(
  import("../styles/editor").then(module => module.InternoteEditor),
  {
    ssr: false
  }
);

let editorInstance: null | Editor = null;

export function Note({ store }: { store: Store }) {
  return (
    <>
      <Box pb={spacing._3}>
        <InternoteEditor
          id={store.state.note.id}
          initialValue={store.state.note.content}
          onChange={content => {
            store.actions.saveNote({
              content
            });
          }}
          exposeEditor={instance => (editorInstance = instance)}
          onDelete={() => store.actions.setDeleteNoteModalOpen(true)}
          saving={store.state.loading}
        />
      </Box>
    </>
  );
}
