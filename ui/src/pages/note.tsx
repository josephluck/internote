import { EMPTY_SCHEMA } from "@internote/lib/schema-examples";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import styled from "styled-components";

import { useStately } from "../store/store";
import { navigateToFirstNote } from "../store/ui/ui";
import { InternoteEditor } from "../styles/editor/internote-editor";
import { Heading } from "../styles/heading";
import { OnMount } from "../styles/on-mount";

const PageWrapper = styled.div`
  min-height: 100%;
  height: 100%;
`;

export const Note: React.FunctionComponent<RouteComponentProps<{
  noteId: string;
}>> = ({ noteId }) => {
  const note = useStately(
    (state) =>
      noteId ? state.notes.notes.find((n) => n.noteId === noteId) : undefined,
    [noteId]
  );

  return (
    <>
      <Heading note={note} />
      <PageWrapper>
        {note ? (
          <InternoteEditor
            initialValue={
              Array.isArray(note.content) ? note.content : EMPTY_SCHEMA
            }
            noteId={note.noteId}
          />
        ) : (
          <OnMount cb={navigateToFirstNote} />
        )}
      </PageWrapper>
    </>
  );
};
