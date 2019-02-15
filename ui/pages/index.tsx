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
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
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
    await store.actions.fetchNote({ noteId: query.id });
  }
  return {
    id: query.id
  };
};

export default withAuth(Page as any);
