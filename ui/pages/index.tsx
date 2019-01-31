import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";
import { Heading } from "../styles/heading";
import { Global } from "../styles/global";
import { Note } from "../styles/note";
import { spacing } from "../styles/theme";
import { Wrapper } from "../styles/wrapper";
import { OnMount } from "../styles/on-mount";

const PageWrapper = Wrapper.extend`
  padding-top: ${spacing._1};
  padding-bottom: ${spacing._1};
`;

const Page: NextTwineSFC<
  State,
  Actions,
  { id: string },
  { id: string }
> = props => {
  return (
    <>
      <Heading store={props.store} />
      <PageWrapper>
        {props.store.state.note && props.id ? (
          <Note store={props.store} />
        ) : (
          <OnMount action={props.store.actions.navigateToFirstNote} />
        )}
      </PageWrapper>
      <Global store={props.store} />
    </>
  );
};

Page.getInitialProps = async ({ store, query }) => {
  await store.actions.fetchNotes();
  if (query && query.id) {
    await store.actions.fetchNote(query.id);
  }
  return {
    id: query.id
  };
};

export default withAuth(Page);
