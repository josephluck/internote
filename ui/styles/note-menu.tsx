import { Store } from "../store";
import { MenuControl } from "./menu-control";
import {
  faPlus,
  faCheck,
  faTrash,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownChevron
} from "./dropdown-menu";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { spacing, font, borderRadius } from "../theming/symbols";
import { Box } from "@rebass/grid";

const DeleteIcon = styled.div`
  margin-left: ${spacing._1_5};
  font-size: ${font._12.size};
  cursor: pointer;
`;

const NotesMenu = styled(DropdownMenu)`
  padding-top: 0;
  overflow: hidden;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${spacing._1};
  top: 50%;
  padding-top: ${spacing._0_25};
  transform: translateY(-50%);
  font-size: ${font._12.size};
  color: ${props => props.theme.dropdownMenuItemText};
  pointer-events: none;
  opacity: 0.6;
  transition: all 300ms ease;
  &:hover {
    opacity: 1;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${spacing._0_5} ${spacing._0_5} ${spacing._0_5} ${spacing._1_75};
  margin: ${spacing._0_25} ${spacing._0_25} 0;
  border: 0;
  background: ${props => props.theme.searchInputBackground};
  color: ${props => props.theme.searchInputText};
  font: inherit;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  outline: none;
  border-radius: ${borderRadius._4};
  transition: all 300ms ease;
  font-weight: 500;
`;

const SearchBoxWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  &:focus-within {
    ${SearchIcon} {
      opacity: 1;
    }
    ${SearchInput} {
      background: ${props => props.theme.searchInputFocusedBackground};
    }
  }
`;

export function NoteMenu({ store }: { store: Store }) {
  return (
    <MenuControl
      menu={menu => (
        <NotesMenu showing={menu.menuShowing} position="center">
          <SearchBoxWrapper>
            <SearchIcon>
              <FontAwesomeIcon icon={faSearch} />
            </SearchIcon>
            <SearchInput placeholder="Search for notes" />
          </SearchBoxWrapper>
          <DropdownMenuItem
            icon={faPlus}
            onClick={() => {
              store.actions.createNote();
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
                  store.actions.deleteNoteConfirmation({ noteId: note.id })
                }
              >
                <FontAwesomeIcon icon={faTrash} />
              </DeleteIcon>
            </DropdownMenuItem>
          ))}
        </NotesMenu>
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
