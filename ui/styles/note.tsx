import * as React from "react";
import { spacing } from "../styles/theme";
import { Toolbar } from "../styles/toolbar";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { Editor } from "draft-js";
import { Store } from "../store";

const InternoteEditor = dynamic(
  import("../styles/editor").then(module => module.InternoteEditor),
  {
    ssr: false
  }
);

const EditorWrap = styled.div`
  padding: ${spacing._1} ${spacing._2};
`;

let editorInstance: null | Editor = null;

const FullHeightWrap = styled.div`
  position: fixed;
  top: 50px;
  bottom: 39px;
  left: 0;
  right: 0;
  overflow: auto;
`;

export function Note({ store }: { store: Store }) {
  return (
    <>
      <FullHeightWrap
        onClick={() => {
          if (editorInstance) {
            editorInstance.focus();
          }
        }}
      >
        <EditorWrap>
          <InternoteEditor
            id={store.state.note.id}
            initialValue={store.state.note.content}
            onChange={content => {
              store.actions.saveNote({
                content
              });
            }}
            exposeEditor={instance => (editorInstance = instance)}
          />
        </EditorWrap>
      </FullHeightWrap>
      <Toolbar
        words={store.state.note.content.split(" ").length}
        saving={store.state.loading}
        onDelete={() => store.actions.setDeleteNoteModalOpen(true)}
      />
    </>
  );
}
