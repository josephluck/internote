import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { Store, useTwineState, useTwineActions } from "../store";
import { withAuth } from "../hoc/with-auth";
import { Heading } from "../styles/heading";
import { Global } from "../styles/global";
import { Note } from "../styles/note";
import { OnMount } from "../styles/on-mount";
import { styled } from "../theming/styled";

const PageWrapper = styled.div`
  min-height: 100%;
  height: 100%;
`;

const Page: NextTwineSFC<Store, { id: string }, { id: string }> = props => {
  const notes = useTwineState(state => state.notes.notes, (prev, next) => prev.length !== next.length)
  const navigateToFirstNote = useTwineActions(actions => actions.ui.navigateToFirstNote)
  const note = props.id ? notes.find(n => n.id === props.id) : null;
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
      store.actions.tags.fetchTags()
    ]);
  } else {
    // No need to wait if notes are already fetched - just update in background
    store.actions.notes.fetchNotes();
    store.actions.tags.fetchTags();
  }
  return {
    id: query.id
  };
};

export default withAuth(Page as any);
