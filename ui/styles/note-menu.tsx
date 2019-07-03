import * as React from "react";
import * as Fuse from "fuse.js";
import { MenuControl } from "./menu-control";
import {
  faPlus,
  faSearch,
  faSpinner,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownChevron
} from "./dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { spacing, font, borderRadius, size } from "../theming/symbols";
import { Note, Tag as TagEntity } from "@internote/api/domains/types";
import { OnNavigate } from "./on-navigate";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { combineStrings } from "../utilities/string";
import { NoResults } from "./no-results";
import { Tag } from "./tag";
import { NoteMenuItem } from "./note-menu-item";
import { useTwine } from "../store";

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

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${font._12.size};
  color: ${props => props.theme.dropdownMenuItemText};
  transition: all 300ms ease;
`;

const SearchIcon = styled(InputIcon)`
  left: ${spacing._0_75};
  pointer-events: none;
`;

const ClearIcon = styled(InputIcon)<{ isShowing: boolean }>`
  right: ${spacing._0_75};
  pointer-events: ${props => (props.isShowing ? "initial" : "none")};
  cursor: ${props => (props.isShowing ? "pointer" : "default")};
  opacity: ${props => (props.isShowing ? 1 : 0)};
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

const TagsWrapper = styled.div`
  padding: 0 ${spacing._0_5};
  border-top: solid 1px ${props => props.theme.dropdownMenuSpacerBorder};
`;

const MaxHeight = styled.div`
  max-height: ${size.notesMenuListMaxHeight};
  overflow: auto;
  margin: ${spacing._0_5} 0;
  padding: ${spacing._0_5} 0;
  border-top: solid 1px ${props => props.theme.dropdownMenuSpacerBorder};
`;

function getNoteTitle(note: Note): string {
  return note.title;
}

export function NoteMenu({
  currentNote,
  onMenuToggled
}: {
  currentNote: Note;
  onMenuToggled: (showing: boolean) => any;
}) {
  const [{ allNotes, tags }, { onDeleteNote, onCreateNote }] = useTwine(
    state => ({
      allNotes: state.notes.notes,
      tags: state.tags.tags
    }),
    actions => ({
      onDeleteNote: (noteId: string) =>
        actions.notes.deleteNoteConfirmation({ noteId }),
      onCreateNote: actions.notes.createNote
    })
  );
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [noteLoading, setNoteLoading] = React.useState(null);
  const [filteredNotes, setFilteredNotes] = React.useState<Note[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isTagSearch = searchText.startsWith("#");

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  React.useEffect(() => {
    searchNotes(searchText);
  }, [searchText, combineStrings(allNotes.map(getNoteTitle))]);

  function searchNotes(value: string) {
    const fuzzy = new Fuse(allNotes, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 30,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: isTagSearch ? ["tags.tag"] : ["title"]
    });
    setFilteredNotes(value.length ? fuzzy.search(value) : allNotes);
  }

  function onTagClicked(tag: TagEntity) {
    setSearchText(tag.tag);
    focusInput();
  }

  return (
    <MenuControl
      onMenuToggled={onMenuToggled}
      menuName="Notes menu"
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
                placeholder="Search for notes"
                ref={inputRef}
                value={searchText}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onInput={e => {
                  setSearchText(e.target.value);
                }}
              />
              <ClearIcon
                isShowing={searchText.length > 0}
                onClick={() => {
                  setSearchText("");
                  focusInput();
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </ClearIcon>
            </SearchBoxWrapper>
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
          <MaxHeight>
            {filteredNotes.length === 0 ? (
              <NoResults emojis="🔎 🙄" message="No notes found" />
            ) : (
              filteredNotes.map(n => (
                <NoteMenuItem
                  isLoading={noteLoading === n.id}
                  isSelected={!!currentNote && n.id === currentNote.id}
                  note={n}
                  onSelect={() => {
                    setNoteLoading(n.id);
                  }}
                  onDelete={() => {
                    menu.toggleMenuShowing(false);
                    onDeleteNote(n.id);
                  }}
                  searchText={isTagSearch ? "" : searchText}
                />
              ))
            )}
          </MaxHeight>
          <TagsWrapper>
            {tags.map(tag => (
              <Tag key={tag.id} onClick={() => onTagClicked(tag)}>
                {tag.tag}
              </Tag>
            ))}
          </TagsWrapper>
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
