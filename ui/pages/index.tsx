import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { Store, useTwineState, useTwineActions } from "../store";
import { withAuth } from "../auth/with-auth";
import { Heading } from "../styles/heading";
import { Global } from "../styles/global";
import { Note } from "../styles/note";
import { OnMount } from "../styles/on-mount";
import styled from "styled-components";
import { FileUpload } from "../styles/file-upload";

const PageWrapper = styled.div`
  min-height: 100%;
  height: 100%;
`;

const Page: NextTwineSFC<Store, { id: string | string[] }> = ({ id }) => {
  const note = useTwineState(
    state => (id ? state.notes.notes.find(n => n.noteId === id) : null),
    [id],
    (prev, next) => prev.noteId === next.noteId
  );
  const navigateToFirstNote = useTwineActions(
    actions => actions.ui.navigateToFirstNote
  );

  return (
    <>
      <Heading note={note} />
      <PageWrapper>
        <br />
        <br />
        <br />
        <br />
        <FileUpload />
        {note ? <Note note={note} /> : <OnMount cb={navigateToFirstNote} />}
      </PageWrapper>
      <Global />
    </>
  );
};

Page.getInitialProps = async ({ store, query }) => {
  if (store.state.notes.notes.length === 0) {
    await Promise.all([
      store.actions.notes.fetchNotes(),
      store.actions.tags.fetchTags(),
      store.actions.snippets.fetchSnippets()
    ]);
  } else {
    // No need to wait if notes are already fetched - just update in background
    store.actions.notes.fetchNotes();
    store.actions.tags.fetchTags();
    store.actions.snippets.fetchSnippets();
  }
  return {
    id: query.id
  };
};

export default withAuth(Page as any, { restricted: true });
