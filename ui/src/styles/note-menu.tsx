import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetNoteDTO } from "@internote/notes-service/types";
import { navigate } from "@reach/router";
import Fuse from "fuse.js";
import React from "react";
import styled from "styled-components";

import { createNote, deleteNote } from "../store/notes/notes";
import { useStately } from "../store/store";
import { size, spacing } from "../theming/symbols";
import { combineStrings } from "../utilities/string";
import {
  DropdownChevron,
  DropdownMenu,
  DropdownMenuItem,
} from "./dropdown-menu";
import { InputWithIcons } from "./input-with-icons";
import { MenuControl } from "./menu-control";
import { NoResults } from "./no-results";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { OnNavigate } from "./on-navigate";
import { SearchMenuItem } from "./search-menu-item";
import { Tag } from "./tag";

export function NoteMenu({
  currentNote,
  onMenuToggled,
}: {
  currentNote: GetNoteDTO | null;
  onMenuToggled: (showing: boolean) => any;
}) {
  const allNotes = useStately((state) => state.notes.notes);
  const tags = useStately((state) => state.tags.tags);

  const [searchFocused, setSearchFocused] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [noteLoading, setNoteLoading] = React.useState<string | null>(null);
  const [filteredNotes, setFilteredNotes] = React.useState<GetNoteDTO[]>([]);
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
      keys: isTagSearch ? ["tags"] : ["title"],
    });
    setFilteredNotes(
      value.length ? fuzzy.search(value).map((v) => v.item) : allNotes
    );
  }

  function onTagClicked(tag: string) {
    setSearchText(tag);
    focusInput();
  }

  return (
    <MenuControl
      onMenuToggled={onMenuToggled}
      menuName="Notes menu"
      menu={(menu) => (
        <NotesMenu
          showing={menu.menuShowing}
          horizontalPosition="center"
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
            <InputWithIcons
              value={searchText}
              placeholder="Search for notes"
              onClear={() => {
                setSearchText("");
                focusInput();
              }}
              onChange={(e: any) => {
                setSearchText(e.target.value);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              isFocused={searchText.length > 0}
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
              createNote();
            }}
          >
            <span>Create a new note</span>
          </DropdownMenuItem>
          <MaxHeight>
            {filteredNotes.length === 0 ? (
              <NoResults emojis="🔎 🙄" message="No notes found" />
            ) : (
              filteredNotes.map((note) => (
                <SearchMenuItem
                  key={note.noteId}
                  isLoading={noteLoading === note.noteId}
                  isSelected={
                    !!currentNote && note.noteId === currentNote.noteId
                  }
                  content={note.title}
                  onSelect={() => {
                    setNoteLoading(note.noteId);
                    navigate(`/?id=${note.noteId}`);
                  }}
                  onDelete={() => {
                    menu.toggleMenuShowing(false);
                    deleteNote(note.noteId); // TODO: confirmation
                  }}
                  searchText={isTagSearch ? "" : searchText}
                />
              ))
            )}
          </MaxHeight>
          <TagsWrapper>
            {tags.map((tag) => (
              <Tag
                key={tag}
                isFocused={false}
                onClick={() => onTagClicked(tag)}
              >
                {tag}
              </Tag>
            ))}
          </TagsWrapper>
        </NotesMenu>
      )}
    >
      {(menu) => (
        <DropdownChevron
          onClick={() => menu.toggleMenuShowing(!menu.menuShowing)}
        >
          {currentNote ? currentNote.title : null}
        </DropdownChevron>
      )}
    </MenuControl>
  );
}

const NotesMenu = styled(DropdownMenu)<{ isExpanded: boolean }>`
  padding-top: 0;
  overflow: hidden;
  transition: all 300ms ease;
  width: ${(props) =>
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

const MaxHeight = styled.div`
  max-height: ${size.notesMenuListMaxHeight};
  overflow: auto;
  margin: ${spacing._0_5} 0;
  padding: ${spacing._0_5} 0;
  border-top: solid 1px ${(props) => props.theme.dropdownMenuSpacerBorder};
`;

const TagsWrapper = styled.div`
  padding: 0 ${spacing._0_5};
  border-top: solid 1px ${(props) => props.theme.dropdownMenuSpacerBorder};
`;

function getNoteTitle(note: GetNoteDTO): string {
  return note.title;
}
