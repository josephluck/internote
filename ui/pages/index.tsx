import * as React from "react";
import { NextSFC } from "next";
import { Box } from "grid-styled";
import { TextLink } from "../styles/link";
import { spacing } from "../styles/theme";
import { Heading } from "../styles/heading";

const Page: NextSFC = props => {
  return (
    <>
      <Heading />
      <Box p={spacing._2}>
        {[].map(note => (
          <Box key={note.id} mb={spacing._1}>
            <TextLink href={`/note?id=${note.id}`}>{note.title}</TextLink>
          </Box>
        ))}
      </Box>
    </>
  );
};

Page.getInitialProps = async (ctx: any) => {
  const newState = await ctx.store.actions.fetchNotes();
  console.log(
    "Index.tsx getInitialProps state after fetching notes: ",
    newState.notes.length
  );
  return {};
};

export default Page;
