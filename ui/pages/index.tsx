import * as React from "react";
import { Box } from "grid-styled";
import Link from "next/link";
import { spacing, color, borderRadius } from "../styles/theme";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";
import styled from "styled-components";
import { ArrowRight } from "styled-icons/fa-solid";

const NoteListItem = styled.div`
  background: ${color.shipGray};
  padding: ${spacing._0_5} ${spacing._1};
  border-radius: ${borderRadius._6};
  margin-bottom: ${spacing._1};
  display: flex;
  cursor: pointer;
`;

const EllipsisText = styled.span`
  display: inline-block;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LinkIcon = styled.div`
  margin-left: ${spacing._1};
  display: flex;
  align-items: center;
  transition: all 300ms ease;
  transform: scale(1, 1) translateX(0px);
  ${NoteListItem}:hover & {
    transform: scale(1.1, 1.1) translateX(3px);
  }
`;

const Page: NextTwineSFC<State, Actions> = props => {
  return (
    <>
      <Box p={spacing._2}>
        <button onClick={() => props.store.actions.newNote()}>New Note</button>
        {props.store.state.notes.map(note => (
          <Link href={`/note?id=${note.id}`}>
            <NoteListItem key={note.id}>
              <EllipsisText>{note.content}</EllipsisText>
              <LinkIcon>
                <ArrowRight height="20" width="20" />
              </LinkIcon>
            </NoteListItem>
          </Link>
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
