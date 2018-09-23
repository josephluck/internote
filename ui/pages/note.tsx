import * as React from "react";
import { spacing } from "../styles/theme";
import { Box } from "grid-styled";
import { Toolbar } from "../styles/toolbar";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { Editor } from "draft-js";

const InternoteEditor = dynamic(
  import("../styles/editor").then(module => module.InternoteEditor),
  {
    ssr: false
  }
);

let editorInstance: null | Editor = null;

const FullHeightWrap = styled.div`
  position: fixed;
  top: 50px;
  bottom: 39px;
  left: 0;
  right: 0;
`;

const Page: NextTwineSFC<State, Actions, {}, { id: string }> = props => {
  return (
    <>
      <FullHeightWrap
        onClick={() => {
          if (editorInstance) {
            editorInstance.focus();
          }
        }}
      >
        <Box p={spacing._2}>
          <InternoteEditor
            id={props.store.state.note.id}
            initialValue={props.store.state.note.content}
            onChange={content => {
              props.store.actions.saveNote({
                id: props.store.state.note.id,
                content
              });
            }}
            exposeEditor={instance => (editorInstance = instance)}
          />
        </Box>
      </FullHeightWrap>
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

export default withAuth(Page);
