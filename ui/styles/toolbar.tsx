import React, { useState, useCallback } from "react";
import {
  ToolbarWrapper,
  ToolbarInner,
  ToolbarExpandedWrapper,
  ToolbarExpandedInner,
  renderToolbarIcon
} from "./toolbar-styles";
import { Flex } from "@rebass/grid";
import { ButtonSpacer, ToolbarButton } from "./toolbar-button";
import { EmojiToggle } from "./emoji-toggle";
import { DictionaryButton } from "./dictionary-button";
import { Speech } from "./speech";
import { DeleteNoteButton } from "./delete-note-button";
import { Saving } from "./saving";
import { Shortcut } from "./shortcuts";
import {
  stringIsOneWord,
  removeFirstLetterFromString,
  getFirstWordFromString
} from "../utilities/string";
import { Collapse } from "react-collapse";
import { TagsList } from "./tags-list";
import { EmojiList } from "./emoji-list";
import { Dictionary } from "./dictionary";
import { ShortcutsReference } from "./shortcuts-reference";
import {
  currentFocusHasMark,
  currentFocusHasBlock,
  currentFocusIsWithinList,
  wordIsEmojiShortcut,
  wordIsTagShortcut,
  hasSelection
} from "../utilities/editor";
import { Option } from "space-lift";
import { Value } from "slate";
import { Emoji } from "../utilities/emojis";
import { useTwineState, useTwineActions } from "../store";
import {
  SchemaMarkType,
  SchemaBlockType
} from "@internote/export-service/types";
import { SnippetsMenu } from "./snippets-menu";
import { GetSnippetDTO } from "@internote/snippets-service/types";

export function Toolbar({
  createNewTag,
  distractionFree,
  id,
  insertEmoji,
  insertTag,
  isDictionaryShowing,
  onClickBlock,
  onClickMark,
  requestDictionary,
  requestSpeech,
  selectedText,
  shortcutSearch,
  value,
  onSnippetSelected
}: {
  createNewTag: (searchText: string) => any;
  distractionFree: boolean;
  id: string;
  insertEmoji: (emoji: Emoji, searchText: string) => any;
  insertTag: (tag: string, searchText: string) => any;
  isDictionaryShowing: boolean;
  onClickBlock: (type: any) => any;
  onClickMark: (type: any) => any;
  requestDictionary: () => any;
  requestSpeech: () => any;
  selectedText: Option<string>;
  shortcutSearch: Option<string>;
  value: Value;
  onSnippetSelected: (snippet: GetSnippetDTO) => void;
}) {
  const tags = useTwineState(state => state.tags.tags);
  const saving = useTwineState(state => state.notes.loading.updateNote);
  const speechSrc = useTwineState(state => state.speech.speechSrc);
  const isSpeechLoading = useTwineState(
    state => state.speech.loading.requestSpeech
  );
  const newTagSaving = useTwineState(state => state.tags.loading.saveNewTag);

  const { onDelete, onDiscardSpeech, onCloseDictionary } = useTwineActions(
    actions => ({
      onDelete: () => actions.notes.deleteNoteConfirmation({ noteId: id }),
      onCloseDictionary: () => actions.dictionary.setDictionaryShowing(false),
      onDiscardSpeech: () => actions.speech.setSpeechSrc(null)
    }),
    [id]
  );

  const isDictionaryLoading = useTwineState(
    state => state.dictionary.loading.lookup
  );
  const dictionaryResults = useTwineState(
    state => state.dictionary.dictionaryResults
  );
  const [isEmojiButtonPressed, setIsEmojiButtonPressed] = React.useState(false);
  const [
    isShortcutsReferenceShowing,
    setIsShortcutsReferenceShowing
  ] = useState(false);

  const isEmojiShortcut = shortcutSearch
    .filter(wordIsEmojiShortcut)
    .isDefined();
  const isTagsShortcut = shortcutSearch.filter(wordIsTagShortcut).isDefined();
  const toolbarIsExpanded =
    isEmojiShortcut ||
    isEmojiButtonPressed ||
    isTagsShortcut ||
    isDictionaryShowing ||
    newTagSaving ||
    isShortcutsReferenceShowing;
  const isToolbarShowing =
    hasSelection(value) || !!speechSrc || toolbarIsExpanded;

  // TODO: for some reason this is true on auto focus...
  const hasHighlighted =
    value.selection &&
    value.selection.start.path &&
    value.selection.end.path &&
    value.selection.start.path !== value.selection.end.path;

  const onToggleDictionary = useCallback(() => {
    if (isDictionaryShowing) {
      onCloseDictionary();
    } else {
      requestDictionary();
    }
  }, [isDictionaryShowing, onCloseDictionary, requestDictionary]);

  const renderMarkButton = (type: SchemaMarkType, shortcutNumber: number) => {
    return (
      <ToolbarButton
        onClick={onClickMark(type) as any}
        isActive={currentFocusHasMark(type, value)}
        shortcutNumber={shortcutNumber}
        shortcutShowing={false}
      >
        {renderToolbarIcon(type)}
      </ToolbarButton>
    );
  };
  const renderBlockButton = (type: SchemaBlockType, shortcutNumber: number) => {
    const isActive =
      currentFocusHasBlock(type, value) ||
      currentFocusIsWithinList(type, value);
    return (
      <ToolbarButton
        onClick={onClickBlock(type) as any}
        isActive={isActive}
        shortcutNumber={shortcutNumber}
      >
        {renderToolbarIcon(type)}
      </ToolbarButton>
    );
  };

  return (
    <ToolbarWrapper
      distractionFree={distractionFree}
      forceShow={isToolbarShowing}
    >
      <ToolbarInner>
        <Flex flex={1}>
          {renderBlockButton("heading-one", 1)}
          {renderBlockButton("heading-two", 2)}
          {renderBlockButton("numbered-list", 3)}
          {renderBlockButton("bulleted-list", 4)}
          {renderBlockButton("ide", 5)}
          {renderBlockButton("block-quote", 6)}
          {renderMarkButton("code", 7)}
          {renderMarkButton("bold", 8)}
          {renderMarkButton("italic", 9)}
          {renderMarkButton("underlined", 0)}
          <ButtonSpacer small>
            <EmojiToggle
              isActive={isEmojiShortcut || isEmojiButtonPressed}
              onClick={() => setIsEmojiButtonPressed(!isEmojiButtonPressed)}
            />
          </ButtonSpacer>
          <ButtonSpacer small>
            <SnippetsMenu
              onSnippetSelected={onSnippetSelected}
              hasHighlighted={hasHighlighted}
            />
          </ButtonSpacer>
        </Flex>
        <Flex alignItems="center">
          <ButtonSpacer small>
            <DictionaryButton
              isShowing={isDictionaryShowing}
              onClick={onToggleDictionary}
            />
          </ButtonSpacer>
          <ButtonSpacer small>
            <Speech
              onRequest={requestSpeech}
              src={speechSrc}
              isLoading={isSpeechLoading}
              onDiscard={onDiscardSpeech}
              onFinished={onDiscardSpeech}
            />
          </ButtonSpacer>
          <ButtonSpacer>
            <DeleteNoteButton onClick={onDelete} />
          </ButtonSpacer>
          <Saving saving={saving} />
        </Flex>
        {isShortcutsReferenceShowing ? (
          <Shortcut
            id="hide-shortcuts-reference"
            description="Hide shortcuts reference"
            keyCombo={["esc", "mod+k"]}
            callback={() => setIsShortcutsReferenceShowing(false)}
          />
        ) : (
          <Shortcut
            id="show-shortcuts-reference"
            description="Show shortcuts reference"
            keyCombo="mod+k"
            callback={() => setIsShortcutsReferenceShowing(true)}
          />
        )}
        {selectedText.isDefined() ? (
          <Shortcut
            id="request-speech"
            description="Speak selected text"
            keyCombo="mod+s"
            callback={requestSpeech}
            disabled={!!speechSrc}
          />
        ) : null}
        {selectedText.filter(stringIsOneWord).isDefined() ? (
          <Shortcut
            id="request-dictionary"
            description="Lookup selected text"
            keyCombo="mod+d"
            callback={requestDictionary}
          />
        ) : null}
      </ToolbarInner>
      <Collapse isOpened={toolbarIsExpanded} style={{ width: "100%" }}>
        <ToolbarExpandedWrapper>
          <ToolbarExpandedInner>
            <ToolbarInner>
              {isTagsShortcut || newTagSaving ? (
                <TagsList
                  onTagSelected={insertTag}
                  onCreateNewTag={createNewTag}
                  tags={tags}
                  search={shortcutSearch
                    .flatMap(removeFirstLetterFromString)
                    .getOrElse("")}
                  newTagSaving={newTagSaving}
                />
              ) : isEmojiButtonPressed || isEmojiShortcut ? (
                <EmojiList
                  onEmojiSelected={(emoji, searchText) => {
                    setIsEmojiButtonPressed(false);
                    insertEmoji(emoji, searchText);
                  }}
                  search={shortcutSearch
                    .flatMap(removeFirstLetterFromString)
                    .getOrElse("")}
                />
              ) : isDictionaryShowing ? (
                <Dictionary
                  isLoading={isDictionaryLoading}
                  results={dictionaryResults}
                  requestedWord={selectedText
                    .flatMap(getFirstWordFromString)
                    .getOrElse("")}
                />
              ) : isShortcutsReferenceShowing ? (
                <ShortcutsReference />
              ) : null}
            </ToolbarInner>
          </ToolbarExpandedInner>
        </ToolbarExpandedWrapper>
      </Collapse>
    </ToolbarWrapper>
  );
}
