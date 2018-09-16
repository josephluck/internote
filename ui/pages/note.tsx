import * as React from "react";
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
        <Editor
          id={props.store.state.note.id}
          initialValue={props.store.state.note.content}
          onChange={content => {
            props.store.actions.saveNote({
              id: props.store.state.note.id,
              content
            });
          }}
        />
      </Box>
      <Toolbar
        words={props.store.state.note.content.split(" ").length}
        saving={props.store.state.loading}
      />
    </>
  );
};

Page.getInitialProps = async ctx => {
  await ctx.store.actions.fetchNote(ctx.query.id);
  return {};
};

export default Page;
