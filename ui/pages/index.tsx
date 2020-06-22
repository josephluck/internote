import React from "react";
import styled from "styled-components";

import { withAuth } from "../auth/with-auth";
import { Store, useTwineActions, useTwineState } from "../store";
import { injectTwine } from "../store";
import { NextTwineSFC } from "../store/with-twine";
import { Global } from "../styles/global";
import { Heading } from "../styles/heading";
import { Note } from "../styles/note";
import { OnMount } from "../styles/on-mount";

const PageWrapper = styled.div`
  min-height: 100%;
  height: 100%;
`;

const Page: NextTwineSFC<Store, { id: string | string[] }> = ({ id }) => {
  const note = useTwineState(
    (state) => (id ? state.notes.notes.find((n) => n.noteId === id) : null),
    [id],
    (prev, next) => prev.noteId === next.noteId
  );

  const navigateToFirstNote = useTwineActions(
    (actions) => actions.ui.navigateToFirstNote
  );

  return (
    <>
      <Heading note={note} />
      <PageWrapper>
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
      store.actions.snippets.fetchSnippets(),
    ]);
  } else {
    store.actions.notes.fetchNotes();
    store.actions.tags.fetchTags();
    store.actions.snippets.fetchSnippets();
  }
  return {
    id: query.id,
  };
};

export default injectTwine(withAuth(Page, { restricted: true }));
