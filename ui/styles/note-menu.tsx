import * as React from "react";
import * as Fuse from "fuse.js";
import { MenuControl } from "./menu-control";
import {
  faPlus,
  faSearch,
  faSpinner,
  faHashtag,
  faList
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownChevron,
  DropdownMenuSpacer,
  DropdownMenuItemWrap
} from "./dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { spacing, font, borderRadius, size } from "../theming/symbols";
import { Note, Tag as TagEntity } from "@internote/api/domains/types";
import { OnNavigate } from "./on-navigate";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { combineStrings } from "../utilities/string";
import { NoResults } from "./no-results";
import { ExpandingIconButton } from "./expanding-icon-button";
import { Tag } from "./tag";
import { NoteMenuItem } from "./note-menu-item";

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

const TagHeadingWrapper = styled(DropdownMenuItemWrap)`
  padding-top: 0;
  padding-bottom: ${spacing._0_25};
`;

function getNoteTitle(note: Note): string {
  return note.title;
}

function getTagText(tag: TagEntity): string {
  return tag.tag;
}

export function NoteMenu({
  allNotes,
  allTags,
  currentNote,
  onCreateNote,
  onMenuToggled,
  onDeleteNote
}: {
  allNotes: Note[];
  allTags: TagEntity[];
  currentNote: Note;
  onCreateNote: () => any;
  onMenuToggled: (showing: boolean) => any;
  onDeleteNote: (noteId: string) => any;
}) {
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [noteLoading, setNoteLoading] = React.useState(null);
  const [filteredNotes, setFilteredNotes] = React.useState<Note[]>([]);
  const [tagView, setTagView] = React.useState(true);
  const untaggedNotes = tagView
    ? filteredNotes.filter(n => !n.tags || n.tags.length === 0)
    : [];
  const notesByTag = tagView
    ? allTags
        .map(tag => ({
          tag: tag.tag,
          notes: filteredNotes.filter(n =>
            n.tags.map(t => t.tag).includes(tag.tag)
          )
        }))
        .concat([{ tag: "#untagged", notes: untaggedNotes }])
        .filter(t => t.notes.length > 0)
    : [];

  const inputRef = React.useRef<HTMLInputElement>(null);
  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  React.useEffect(() => {
    searchNotes(searchText);
  }, [
    searchText,
    combineStrings(allNotes.map(getNoteTitle)),
    combineStrings(allTags.map(getTagText))
  ]);

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
                placeholder="Search for notes"
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
              text={tagView ? "List view" : "Tags view"}
              onClick={() => setTagView(!tagView)}
              icon={
                tagView ? (
                  <FontAwesomeIcon icon={faList} />
                ) : (
                  <FontAwesomeIcon icon={faHashtag} />
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
          {tagView ? (
            <>
              {notesByTag.length === 0 ? (
                <NoResults emojis="🔎 🙄" message="No notes found" />
              ) : (
                notesByTag.map((tag, i) => (
                  <div key={tag.tag}>
                    {i !== 0 ? <DropdownMenuSpacer /> : null}
                    <TagHeadingWrapper>
                      <Tag isFocused>{tag.tag}</Tag>
                    </TagHeadingWrapper>
                    {tag.notes.map(n => (
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
                        searchText={searchText}
                      />
                    ))}
                  </div>
                ))
              )}
            </>
          ) : (
            <>
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
                    searchText={searchText}
                  />
                ))
              )}
            </>
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
