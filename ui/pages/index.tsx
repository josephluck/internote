import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";
import Heading from "../styles/heading";

const Page: NextTwineSFC<State, Actions> = props => {
  return (
    <>
      <Heading store={props.store} />
      <div>Editor here</div>
    </>
  );
};

Page.getInitialProps = async ({ store }) => {
  await store.actions.fetchNotes();
  return {};
};

export default withAuth(Page);
