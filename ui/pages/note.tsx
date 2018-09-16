import * as React from "react";
import { NextSFC } from "next";
import * as fixtures from "@internote/fixtures";
import * as Types from "@internote/api/types";
import { Editor } from "../styles/editor";
import { spacing } from "../styles/theme";
import { Box } from "grid-styled";
import { Heading } from "../styles/heading";
import { Toolbar } from "../styles/toolbar";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";

const Page: NextTwineSFC<State, Actions, {}, { id: string }> = props => {
  return (
    <>
      <Heading />
      <Box p={spacing._2}>
        <Editor initialValue={props.store.state.note.content} />
      </Box>
      <Toolbar />
    </>
  );
};

Page.getInitialProps = async ctx => {
  await ctx.store.actions.fetchNote(ctx.query.id);
  return {};
};

export default Page;
