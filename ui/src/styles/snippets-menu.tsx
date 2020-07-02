import { faCut, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetSnippetDTO } from "@internote/snippets-service/types";
import Fuse from "fuse.js";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { useTwineActions, useTwineState } from "../store";
import { font, size, spacing } from "../theming/symbols";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuItem } from "./dropdown-menu";
import { InputWithIcons } from "./input-with-icons";
import { MenuControl } from "./menu-control";
import { NoResults } from "./no-results";
import { SearchMenuItem } from "./search-menu-item";
import { Shortcut } from "./shortcuts";
import { SnippetsContext } from "./snippets-context";
import { ToolbarButton } from "./toolbar-button";

export const SnippetsButton: React.FunctionComponent<{
  onSnippetSelected: (snippet: GetSnippetDTO) => void;
  hasHighlighted: boolean;
  onCreateSnippet: () => void;
}> = ({ onSnippetSelected, hasHighlighted, onCreateSnippet }) => {
  const {
    snippetsMenuShowing,
    setSnippetToInsert,
    setSnippetsMenuShowing,
  } = useContext(SnippetsContext);

  const snippets = useTwineState((state) => state.snippets.snippets);

  const [inputText, setInputText] = useState("");

  const [instructionsShowing, setInstructionsShowing] = useState(false);

  const [searchFocused, setSearchFocused] = useState(false);

  const [filteredSnippets, setFilteredSnippets] = useState<GetSnippetDTO[]>([]);

  const [snippetBeingDeleted, setSnippetBeingDeleted] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const deleteSnippet = useTwineActions(
    (actions) => actions.snippets.deleteSnippet
  );

  const deleteSnippetLoading = false;

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  useEffect(() => {
    searchSnippets(inputText);
  }, [inputText, snippets.length]);

  function searchSnippets(value: string) {
    const fuzzy = new Fuse(snippets, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 30,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["title"],
    });
    setFilteredSnippets(
      value.length ? fuzzy.search(value).map((v) => v.item) : snippets
    );
  }

  const onDeleteSnippet = useCallback(async (snippetId: string) => {
    setSnippetBeingDeleted(snippetId);
    await deleteSnippet(snippetId);
    setSnippetBeingDeleted("");
  }, []);

  const handleShowInstructions = useCallback(() => {
    setInstructionsShowing(true);
  }, []);

  const handleHideInstructions = useCallback(() => {
    setInstructionsShowing(false);
  }, []);

  return (
    <>
      <MenuControl
        menuName="Snippets menu"
        onMenuToggled={setSnippetsMenuShowing}
        forceShow={snippetsMenuShowing}
        menu={(menu) => (
          <SnippetsDropdownMenu
            showing={menu.menuShowing}
            horizontalPosition="center"
            verticalPosition="top"
            isExpanded={searchFocused || inputText.length > 0}
          >
            <>
              {instructionsShowing ? (
                <InstructionsWrapper>
                  <Instructions>
                    To create a new snippet, highlight the selection you would
                    like to save, and press the "Create snippet" button in the
                    toolbar.
                  </Instructions>
                  <Button fullWidth onClick={handleHideInstructions}>
                    Got it
                  </Button>
                </InstructionsWrapper>
              ) : (
                <>
                  {menu.menuShowing && !searchFocused ? (
                    <Shortcut
                      id="search-snippets"
                      description="Search snippets"
                      preventOtherShortcuts
                      keyCombo="s"
                      callback={focusInput}
                    />
                  ) : null}
                  <HeadingWrapper>
                    <InputWithIcons
                      value={inputText}
                      placeholder="Search for snippets"
                      onClear={() => {
                        setInputText("");
                        focusInput();
                      }}
                      onChange={(e: any) => {
                        setInputText(e.target.value);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      isFocused={inputText.length > 0}
                    />
                  </HeadingWrapper>
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={handleShowInstructions}
                  >
                    <span>Create a new snippet</span>
                  </DropdownMenuItem>

                  <MaxHeight
                    onMouseOut={() => {
                      setSnippetToInsert(null);
                    }}
                  >
                    {filteredSnippets.length === 0 ? (
                      <NoResults emojis="🔎 🙄" message="No snippets found" />
                    ) : (
                      filteredSnippets.map((snippet) => (
                        <SearchMenuItem
                          key={snippet.snippetId}
                          content={snippet.title}
                          onMouseIn={() => {
                            setSnippetToInsert(snippet);
                          }}
                          onSelect={() => {
                            menu.toggleMenuShowing(false);
                            setSnippetToInsert(null);
                            onSnippetSelected(snippet);
                          }}
                          onDelete={() => {
                            onDeleteSnippet(snippet.snippetId);
                          }}
                          deleteLoading={
                            deleteSnippetLoading &&
                            snippet.snippetId === snippetBeingDeleted
                          }
                          searchText={inputText}
                        />
                      ))
                    )}
                  </MaxHeight>
                </>
              )}
            </>
          </SnippetsDropdownMenu>
        )}
      >
        {(menu) => (
          <ToolbarButton
            onClick={() => {
              if (hasHighlighted) {
                onCreateSnippet();
              } else {
                menu.toggleMenuShowing(!menu.menuShowing);
              }
            }}
            label={hasHighlighted ? "Create snippet" : "Snippets"}
            icon={<FontAwesomeIcon icon={faCut} />}
          />
        )}
      </MenuControl>
    </>
  );
};

const SnippetsDropdownMenu = styled(DropdownMenu)<{ isExpanded: boolean }>`
  padding-top: 0;
  overflow: hidden;
  transition: all 300ms ease;
  margin-bottom: ${spacing._0_5};
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
  margin: ${spacing._0_5} 0 0;
  padding: ${spacing._0_5} 0 0;
  border-top: solid 1px ${(props) => props.theme.dropdownMenuSpacerBorder};
`;

const InstructionsWrapper = styled.div`
  padding: 0 ${spacing._1};
`;

const Instructions = styled.p`
  font-size: ${font._16.size};
  line-height: ${font._16.lineHeight};
`;
