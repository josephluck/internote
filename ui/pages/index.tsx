import * as React from "react";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { withAuth } from "../hoc/with-auth";
import { Heading } from "../styles/heading";
import { Global } from "../styles/global";
import { Note } from "../styles/note";
import Link from "next/link";
import styled from "styled-components";
import { color, spacing, borderRadius } from "../styles/theme";
import { Wrapper } from "../styles/wrapper";

const NoteList = Wrapper.extend`
  padding-top: ${spacing._1};
  padding-bottom: ${spacing._1};
`;

const NoteListItem = styled.a`
  display: block;
  background: ${color.black};
  padding: ${spacing._0_5} ${spacing._1};
  border-radius: ${borderRadius._6};
  margin-bottom: 3px;
  overflow: hidden;
  color: ${color.iron};
  text-decoration: none;
`;

const EllipsisText = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Page: NextTwineSFC<
  State,
  Actions,
  { id: string },
  { id: string }
> = props => {
  return (
    <>
      <Heading store={props.store} />
      <NoteList>
        {props.store.state.note && props.id ? (
          <Note store={props.store} />
        ) : (
          <>
            {props.store.state.notes.map(note => (
              <Link href={`?id=${note.id}`} passHref key={note.id}>
                <NoteListItem>
                  <EllipsisText>{note.content}</EllipsisText>
                </NoteListItem>
              </Link>
            ))}
          </>
        )}
      </NoteList>
      <Global store={props.store} />
    </>
  );
};

Page.getInitialProps = async ({ store, query }) => {
  await store.actions.fetchNotes();
  if (query && query.id) {
    await store.actions.fetchNote(query.id);
  } else {
    store.actions.setNote(null);
  }
  return {
    id: query.id
  };
};

export default withAuth(Page);
