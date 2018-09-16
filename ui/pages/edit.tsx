import * as React from "react";
import { NextSFC } from "next";
import * as fixtures from "@internote/fixtures";
import * as Types from "@internote/api/types";
import { Editor } from "../styles/editor";
import { spacing } from "../styles/theme";
import { Box } from "grid-styled";
import { Heading } from "../styles/heading";
import { Saving } from "../styles/saving";

const Page: NextSFC<{ note: Types.Note }> = ({ note }) => (
  <>
    <Heading right={<Saving saving={true} />} />
    <Box p={spacing._2}>
      <Editor initialValue={note.content} />
    </Box>
  </>
);

Page.getInitialProps = _ctx => {
  return Promise.resolve({
    note: fixtures.note()
  });
};

export default Page;
