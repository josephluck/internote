import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";
import { Heading } from "../styles/heading";
import { Global } from "../styles/global";
import { Note } from "../styles/note";

const Page: NextTwineSFC<State, Actions, {}, { id: string }> = props => {
  return (
    <>
      <Heading store={props.store} />
      {props.store.state.note ? <Note store={props.store} /> : null}
      <Global store={props.store} />
    </>
  );
};

Page.getInitialProps = async ({ store, query }) => {
  await store.actions.fetchNotes();
  if (query && query.id) {
    await store.actions.fetchNote(query.id);
  } else {
    store.actions.setNote(null);
  }
  return {};
};

export default withAuth(Page);
