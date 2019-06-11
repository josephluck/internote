import * as React from "react";
import * as Fuse from "fuse.js";
import { MenuControl } from "./menu-control";
import {
  faPlus,
  faCheck,
  faTrash,
  faSearch,
  faSpinner,
  faHashtag,
  faList
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownChevron,
  DropdownMenuSpacer
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
import { combineStrings } from "../utilities/string";
import { NoResults } from "./no-results";
import { ExpandingIconButton } from "./expanding-icon-button";

const DeleteIcon = styled.div`
  margin-left: ${spacing._1_5};
  font-size: ${font._12.size};
  cursor: pointer;
  transition: all 300ms ease;
  transform: scale(0.8, 0.8);
  opacity: 0;
`;

const NoteMenuItem = styled(DropdownMenuItem)`
  &:hover {
    ${DeleteIcon} {
      transform: scale(1, 1);
      opacity: 0.2;
      &:hover {
        opacity: 1;
      }
    }
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

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-right: ${spacing._0_25};
  margin: ${spacing._0_25} ${spacing._0_25} 0;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${spacing._0_75};
  top: 50%;
  transform: translateY(-50%);
  font-size: ${font._12.size};
  color: ${props => props.theme.dropdownMenuItemText};
  pointer-events: none;
  transition: all 300ms ease;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${spacing._0_5} ${spacing._0_5} ${spacing._0_5} ${spacing._1_75};
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
  flex: 1;
  margin-right: ${spacing._0_5};
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
    font-weight: 900;
    background: inherit;
    color: ${props => props.theme.dropdownMenuItemText};
  }
`;

function getNoteTitle(note: Note): string {
  return note.title;
}

export function NoteMenu({
  allNotes,
  currentNote,
  onCreateNote,
  onMenuToggled,
  onDeleteNote
}: {
  allNotes: Note[];
  currentNote: Note;
  onCreateNote: () => any;
  onMenuToggled: (showing: boolean) => any;
  onDeleteNote: (noteId: string) => any;
}) {
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [noteLoading, setNoteLoading] = React.useState(null);
  const [filteredNotes, setFilteredNotes] = React.useState<Note[]>([]);
  const [tagView, setTagView] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  React.useEffect(() => {
    searchNotes(searchText);
  }, [allNotes.length, searchText, combineStrings(allNotes.map(getNoteTitle))]);

  function searchNotes(value: string) {
    const fuzzy = new Fuse(allNotes, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 30,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["title"]
    });
    setFilteredNotes(value.length ? fuzzy.search(value) : allNotes);
  }

  return (
    <MenuControl
      onMenuToggled={onMenuToggled}
      menu={menu => (
        <NotesMenu
          showing={menu.menuShowing}
          position="center"
          isExpanded={searchFocused || searchText.length > 0}
        >
          <OnNavigate
            onComplete={() => {
              setNoteLoading(null);
              setSearchText("");
              menu.toggleMenuShowing(false);
            }}
          />
          <OnKeyboardShortcut
            keyCombo="mod+o"
            cb={() => menu.toggleMenuShowing(true)}
          />
          {menu.menuShowing && !searchFocused ? (
            <OnKeyboardShortcut keyCombo="s" cb={focusInput} />
          ) : null}
          <HeadingWrapper>
            <SearchBoxWrapper hasSearch={searchText.length > 0}>
              <SearchIcon>
                <FontAwesomeIcon icon={faSearch} />
              </SearchIcon>
              <SearchInput
                placeholder="Search for notes or tags"
                ref={inputRef}
                value={searchText}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onInput={e => {
                  setSearchText(e.target.value);
                }}
              />
            </SearchBoxWrapper>
            <ExpandingIconButton
              forceShow={false}
              text={tagView ? "Tags view" : "List view"}
              onClick={() => setTagView(!tagView)}
              icon={
                tagView ? (
                  <FontAwesomeIcon icon={faHashtag} />
                ) : (
                  <FontAwesomeIcon icon={faList} />
                )
              }
            />
          </HeadingWrapper>
          <DropdownMenuItem
            icon={
              noteLoading === "new-note" ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faPlus} />
              )
            }
            onClick={() => {
              setNoteLoading("new-note");
              onCreateNote();
            }}
          >
            <span>Create a new note</span>
          </DropdownMenuItem>
          <DropdownMenuSpacer />
          {filteredNotes.length === 0 ? (
            <NoResults emojis="🔎 🙄" message="No notes found" />
          ) : (
            filteredNotes.map(n => (
              <NoteMenuItem
                key={n.id}
                icon={
                  noteLoading === n.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : noteLoading === null &&
                    currentNote &&
                    n.id === currentNote.id ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : null
                }
              >
                <Box
                  flex="1"
                  style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  onClick={() => {
                    setNoteLoading(n.id);
                  }}
                >
                  <Link href={`?id=${n.id}`} passHref>
                    <a>
                      <Highlighter
                        searchWords={searchText.split("")}
                        autoEscape={true}
                        textToHighlight={n.title}
                        hasSearch={searchText.length > 0}
                      />
                    </a>
                  </Link>
                </Box>
                <DeleteIcon
                  onClick={() => {
                    menu.toggleMenuShowing(false);
                    onDeleteNote(n.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </DeleteIcon>
              </NoteMenuItem>
            ))
          )}
        </NotesMenu>
      )}
    >
      {menu => (
        <DropdownChevron
          onClick={() => menu.toggleMenuShowing(!menu.menuShowing)}
        >
          {currentNote ? currentNote.title : null}
        </DropdownChevron>
      )}
    </MenuControl>
  );
}
