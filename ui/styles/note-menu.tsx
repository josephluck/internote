import { Store } from "../store";
import { MenuControl } from "./menu-control";
import { faPlus, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownChevron
} from "./dropdown-menu";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { spacing, font } from "./theme";
import { Box } from "grid-styled";

const DeleteIcon = styled.div`
  margin-left: ${spacing._0_75};
  font-size: ${font._12.size};
  cursor: pointer;
`;

export function NoteMenu({ store }: { store: Store }) {
  return (
    <MenuControl
      menu={menu => (
        <DropdownMenu showing={menu.menuShowing} position="center">
          <DropdownMenuItem
            icon={faPlus}
            onClick={() => {
              store.actions.newNote();
              menu.toggleMenuShowing(false);
            }}
          >
            <a href="">New note</a>
          </DropdownMenuItem>
          {store.state.notes.map(note => (
            <DropdownMenuItem
              key={note.id}
              icon={
                store.state.note && store.state.note.id === note.id
                  ? faCheck
                  : null
              }
              onClick={() => menu.toggleMenuShowing(false)}
            >
              <Box flex="1">
                <Link href={`?id=${note.id}`} passHref>
                  <a>{note.title}</a>
                </Link>
              </Box>
              <DeleteIcon
                onClick={() =>
                  store.actions.deleteNoteFlow({ noteId: note.id })
                }
              >
                <FontAwesomeIcon icon={faTrash} />
              </DeleteIcon>
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      )}
    >
      {menu => (
        <DropdownChevron
          onClick={() => menu.toggleMenuShowing(!menu.menuShowing)}
        >
          {store.state.note ? store.state.note.title : null}
        </DropdownChevron>
      )}
    </MenuControl>
  );
}
