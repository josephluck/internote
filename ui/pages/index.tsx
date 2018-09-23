import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";
import Heading from "../styles/heading";
import { Note } from "../styles/note";

const Page: NextTwineSFC<State, Actions, {}, { id: string }> = props => {
  return (
    <>
      <Heading store={props.store} />
      {props.store.state.note ? (
        <Note store={props.store} />
      ) : (
        <div>Please choose a note</div>
      )}
    </>
  );
};

Page.getInitialProps = async ({ store, query }) => {
  await store.actions.fetchNotes();
  if (query) {
    await store.actions.fetchNote(query.id);
  }
  return {};
};

export default withAuth(Page);
