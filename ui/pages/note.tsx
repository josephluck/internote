import * as React from "react";
import { NextSFC } from "next";
import * as fixtures from "@internote/fixtures";
import * as Types from "@internote/api/types";
import { Editor } from "../styles/editor";
import { spacing } from "../styles/theme";
import { Box } from "grid-styled";
import { Heading } from "../styles/heading";
import { Toolbar } from "../styles/toolbar";

const Page: NextSFC<{ note: Types.Note }> = props => {
  return (
    <>
      <Heading />
      <Box p={spacing._2}>
        <Editor initialValue={props.note.content} />
      </Box>
      <Toolbar />
    </>
  );
};

Page.getInitialProps = (ctx: any) => {
  console.log(ctx.store);
  return Promise.resolve({
    note: fixtures.note()
  });
};

export default Page;
