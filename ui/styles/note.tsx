import * as React from "react";
import dynamic from "next/dynamic";
import { Store } from "../store";
import { Box } from "@rebass/grid";
import { spacing } from "./theme";

const InternoteEditor = dynamic(
  import("../styles/editor").then(module => module.InternoteEditor),
  {
    ssr: false
  }
);

export function Note({ store }: { store: Store }) {
  return (
    <>
      <Box pb={spacing._3}>
        <InternoteEditor
          id={store.state.note.id}
          initialValue={store.state.note.content}
          onChange={store.actions.updateNote}
          onDelete={() =>
            store.actions.deleteNoteConfirmation({
              noteId: store.state.note.id
            })
          }
          saving={store.state.loading.updateNote}
        />
      </Box>
    </>
  );
}
