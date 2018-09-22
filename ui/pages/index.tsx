import * as React from "react";
import { Box } from "grid-styled";
import { TextLink } from "../styles/link";
import { spacing } from "../styles/theme";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";

const Page: NextTwineSFC<State, Actions> = props => {
  return (
    <>
      <button onClick={props.store.actions.fetchNotes}>Update</button>
      <Box p={spacing._2}>
        {props.store.state.notes.map(note => (
          <Box key={note.id} mb={spacing._1}>
            <TextLink href={`/note?id=${note.id}`}>{note.title}</TextLink>
          </Box>
        ))}
      </Box>
    </>
  );
};

Page.getInitialProps = async ({ store }) => {
  await store.actions.fetchNotes();
  return {};
};

export default withAuth(Page);
