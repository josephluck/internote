import * as React from "react";
import * as Fuse from "fuse.js";
import { Store } from "../store";
import { MenuControl } from "./menu-control";
import {
  faPlus,
  faCheck,
  faTrash,
  faSearch,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownChevron
} from "./dropdown-menu";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { spacing, font, borderRadius, size } from "../theming/symbols";
import { Box } from "@rebass/grid";
import { Note } from "@internote/api/domains/types";
import ReactHighlight from "react-highlight-words";
import { OnNavigate } from "./on-navigate";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";

const DeleteIcon = styled.div`
  margin-left: ${spacing._1_5};
  font-size: ${font._12.size};
  cursor: pointer;
  opacity: 0.7;
  transition: all 300ms ease;
  &:hover {
    opacity: 1;
  }
`;

const NotesMenu = styled(DropdownMenu)<{ isExpanded: boolean }>`
  padding-top: 0;
  overflow: hidden;
  transition: all 300ms ease;
  width: ${props =>
    props.isExpanded
      ? size.notesMenuDropdownWidthExpanded
      : size.notesMenuDropdownWidth};
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
  transition: all 300ms ease;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${spacing._0_5} ${spacing._0_5} ${spacing._0_5} ${spacing._1_75};
  margin: ${spacing._0_25} ${spacing._0_25} 0;
  border: 0;
  color: ${props => props.theme.searchInputText};
  font: inherit;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  outline: none;
  border-radius: ${borderRadius._4};
  transition: all 300ms ease;
  font-weight: 500;
`;

const SearchBoxWrapper = styled.div<{ hasSearch: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  &:hover {
    ${SearchIcon} {
      opacity: 1;
    }
  }
  &:focus-within {
    ${SearchIcon} {
      opacity: 1;
    }
    ${SearchInput} {
      background: ${props => props.theme.searchInputFocusedBackground};
    }
  }
  ${SearchIcon} {
    opacity: ${props => (props.hasSearch ? 1 : 0.7)};
  }
  ${SearchInput} {
    background: ${props =>
      props.hasSearch
        ? props.theme.searchInputFocusedBackground
        : props.theme.searchInputBackground};
  }
`;

const Highlighter = styled(ReactHighlight)<{ hasSearch: boolean }>`
  font-weight: ${props => (props.hasSearch ? 500 : 600)};
  color: ${props =>
    props.hasSearch
      ? props.theme.notesMenuItemTextInactive
      : props.theme.dropdownMenuItemText};
  mark {
    font-weight: 800;
    background: inherit;
    color: ${props => props.theme.dropdownMenuItemText};
  }
`;

interface Props {
  store: Store;
}

interface State {
  notes: Note[];
  searchText: string;
  searchFocused: boolean;
  noteLoading: string | null;
}

export class NoteMenu extends React.Component<Props, State> {
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      notes: props.store.state.notes,
      searchText: "",
      searchFocused: false,
      noteLoading: null
    };
    this.inputRef = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.store.state.notes.length !== this.props.store.state.notes.length
    ) {
      this.searchNotes(this.state.searchText);
    }
  }

  searchNotes = (searchText: string) => {
    this.setState(
      {
        searchText
      },
      () => {
        const fuzzy = new Fuse(this.props.store.state.notes, {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ["title"]
        });
        this.setState({
          notes: searchText.length
            ? fuzzy.search(searchText)
            : this.props.store.state.notes
        });
      }
    );
  };

  focusInput = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  onSearchFocus = () => {
    this.setState({ searchFocused: true });
  };

  onSearchBlur = () => {
    this.setState({ searchFocused: false });
  };

  setNoteLoading = (noteLoading: string | null) => {
    this.setState({
      noteLoading
    });
  };

  render() {
    const { store } = this.props;
    const { notes, searchText, searchFocused, noteLoading } = this.state;
    return (
      <MenuControl
        menu={menu => (
          <NotesMenu
            showing={menu.menuShowing}
            position="center"
            isExpanded={searchFocused || searchText.length > 0}
          >
            <OnNavigate
              onComplete={() => {
                this.searchNotes("");
                this.setNoteLoading(null);
                menu.toggleMenuShowing(false);
              }}
            />
            <OnKeyboardShortcut
              keyCombo="mod+o"
              cb={() => menu.toggleMenuShowing(true)}
            />
            {menu.menuShowing ? (
              <OnKeyboardShortcut keyCombo="s" cb={this.focusInput} />
            ) : null}
            <SearchBoxWrapper hasSearch={searchText.length > 0}>
              <SearchIcon>
                <FontAwesomeIcon icon={faSearch} />
              </SearchIcon>
              <SearchInput
                placeholder="Search for notes"
                ref={this.inputRef}
                value={searchText}
                onFocus={this.onSearchFocus}
                onBlur={this.onSearchBlur}
                onInput={e => {
                  this.searchNotes(e.target.value);
                }}
              />
            </SearchBoxWrapper>
            <DropdownMenuItem
              icon={
                noteLoading === "new-note" ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faPlus} />
                )
              }
              onClick={() => {
                this.setNoteLoading("new-note");
                store.actions.createNote();
              }}
            >
              <a href="">Create a new note</a>
            </DropdownMenuItem>
            {notes.map(note => (
              <DropdownMenuItem
                key={note.id}
                icon={
                  noteLoading === note.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : noteLoading === null &&
                    store.state.note &&
                    store.state.note.id === note.id ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : null
                }
              >
                <Box
                  flex="1"
                  style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  onClick={() => {
                    this.setNoteLoading(note.id);
                  }}
                >
                  <Link href={`?id=${note.id}`} passHref>
                    <a>
                      <Highlighter
                        searchWords={searchText.split("")}
                        autoEscape={true}
                        textToHighlight={note.title}
                        hasSearch={searchText.length > 0}
                      />
                    </a>
                  </Link>
                </Box>
                <DeleteIcon
                  onClick={() => {
                    menu.toggleMenuShowing(false);
                    store.actions.deleteNoteConfirmation({ noteId: note.id });
                  }}
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
}
