import { NoResults } from "./no-results";
import { useTwineState, useTwineActions } from "../store";
import { useCallback, useState, useRef, useEffect } from "react";
import { MenuControl } from "./menu-control";
import Fuse from "fuse.js";
import { InputWithIcons } from "./input-with-icons";
import { DropdownMenuItem, DropdownMenu } from "./dropdown-menu";
import { faPlus, faCut } from "@fortawesome/free-solid-svg-icons";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import React from "react";
import { Flex } from "@rebass/grid";
import { spacing, size } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap
} from "./toolbar-expanding-button";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchMenuItem } from "./search-menu-item";
import styled from "styled-components";
import { Snippet } from "../store/snippets";

const SnippetsDropdownMenu = styled(DropdownMenu)<{ isExpanded: boolean }>`
  padding-top: 0;
  overflow: hidden;
  transition: all 300ms ease;
  margin-bottom: ${spacing._0_5};
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

const MaxHeight = styled.div`
  max-height: ${size.notesMenuListMaxHeight};
  overflow: auto;
  margin: ${spacing._0_5} 0 0;
  padding: ${spacing._0_5} 0 0;
  border-top: solid 1px ${props => props.theme.dropdownMenuSpacerBorder};
`;

export function SnippetsMenu() {
  const isLoading = useTwineState(
    state => state.snippets.loading.fetchSnippets
  );
  const saveSnippet = useTwineActions(
    actions => actions.snippets.createSnippet
  );
  const fetchSnippets = useTwineActions(
    actions => actions.snippets.fetchSnippets
  );
  const snippets = useTwineState(state => state.snippets.snippets);
  const [inputText, setInputText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  useEffect(() => {
    searchSnippets(inputText);
  }, [inputText, snippets.length]);

  const onMenuToggled = useCallback((isShowing: boolean) => {
    if (isShowing) {
      fetchSnippets();
    }
  }, []);

  const saveNewSnippet = useCallback(() => {
    saveSnippet({ title: inputText, content: {} } as any);
  }, [inputText]);

  function searchSnippets(value: string) {
    const fuse: any = Fuse; // TODO: fix types
    const fuzzy = new fuse(snippets, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 30,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["title"]
    });
    setFilteredSnippets(value.length ? fuzzy.search(value) : snippets);
  }

  return (
    <MenuControl
      menuName="Snippets menu"
      onMenuToggled={onMenuToggled}
      menu={menu => (
        <SnippetsDropdownMenu
          showing={menu.menuShowing}
          horizontalPosition="center"
          verticalPosition="top"
          isExpanded={searchFocused || inputText.length > 0}
        >
          {menu.menuShowing && !searchFocused ? (
            <OnKeyboardShortcut keyCombo="s" cb={focusInput} />
          ) : null}
          <HeadingWrapper>
            <InputWithIcons
              value={inputText}
              placeholder="Search for snippets"
              onClear={() => {
                setInputText("");
                focusInput();
              }}
              onInput={(e: any) => {
                setInputText(e.target.value);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              isFocused={inputText.length > 0}
            />
          </HeadingWrapper>
          <DropdownMenuItem
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={saveNewSnippet}
          >
            <span>Create a new snippet</span>
          </DropdownMenuItem>
          <MaxHeight>
            {filteredSnippets.length === 0 ? (
              <NoResults emojis="🔎 🙄" message="No snippets found" />
            ) : (
              filteredSnippets.map(snippet => (
                <SearchMenuItem
                  content={snippet.title}
                  onSelect={() => {
                    console.log("TODO: insert this snippet");
                  }}
                  onDelete={() => {
                    menu.toggleMenuShowing(false);
                    console.log("TODO: delete snippet from DB");
                  }}
                  searchText={inputText}
                />
              ))
            )}
          </MaxHeight>
        </SnippetsDropdownMenu>
      )}
    >
      {menu => (
        <CollapseWidthOnHover
          onClick={() => menu.toggleMenuShowing(!menu.menuShowing)}
          forceShow={menu.menuShowing}
          collapsedContent={<Flex pl={spacing._0_25}>Snippets</Flex>}
        >
          {collapse => (
            <ToolbarExpandingButton forceShow={menu.menuShowing}>
              <ToolbarExpandingButtonIconWrap>
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faCut} />
                )}
              </ToolbarExpandingButtonIconWrap>
              {collapse.renderCollapsedContent()}
            </ToolbarExpandingButton>
          )}
        </CollapseWidthOnHover>
      )}
    </MenuControl>
  );
}
