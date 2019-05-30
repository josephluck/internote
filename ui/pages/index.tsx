import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
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

const Page: NextTwineSFC<
  State,
  Actions,
  { id: string },
  { id: string }
> = props => {
  const note = props.id
    ? props.store.state.notes.find(n => n.id === props.id)
    : null;
  return (
    <>
      <Heading store={props.store} note={note} />
      <PageWrapper>
        {note ? (
          <Note store={props.store} note={note} />
        ) : (
          <OnMount cb={props.store.actions.navigateToFirstNote} />
        )}
      </PageWrapper>
      <Global store={props.store} />
    </>
  );
};

Page.getInitialProps = async ({ store, query }) => {
  if (store.state.notes.length === 0) {
    await store.actions.fetchNotes();
  } else {
    // No need to wait if notes are already fetched - just update in background
    store.actions.fetchNotes();
  }
  return {
    id: query.id
  };
};

export default withAuth(Page as any);
