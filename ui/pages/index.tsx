import * as React from "react";
import { Box } from "grid-styled";
import { TextLink } from "../styles/link";
import { spacing } from "../styles/theme";
import { Heading } from "../styles/heading";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";

const Page: NextTwineSFC<State, Actions> = props => {
  return (
    <>
      <Heading />
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

export default Page;
