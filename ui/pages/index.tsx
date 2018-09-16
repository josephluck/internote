import * as React from "react";
import { NextSFC } from "next";
import { TextLink } from "@internote/ui/styles/link";
import * as fixtures from "@internote/fixtures";
import * as Types from "@internote/api/types";
import { Box } from "grid-styled";
import { spacing } from "@internote/ui/styles/theme";
import { Heading } from "@internote/ui/styles/heading";

const Page: NextSFC<{ notes: Types.Note[] }> = ({ notes }) => (
  <>
    <Heading />
    <Box p={spacing._2}>
      {notes.map(note => (
        <div key={note.id}>
          <TextLink href={`/edit?id=${note.id}`}>{note.title}</TextLink>
        </div>
      ))}
    </Box>
  </>
);

Page.getInitialProps = () => {
  return Promise.resolve({
    notes: [fixtures.note(), fixtures.note(), fixtures.note()]
  });
};

export default Page;
