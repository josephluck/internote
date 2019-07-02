import React, { useState } from "react";
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
import { MarkType, BlockType } from "../utilities/serializer";
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
import { Tag, DictionaryResult } from "@internote/api/domains/types";
import { Emoji } from "../utilities/emojis";

export function Toolbar({
  shortcutSearch,
  isDictionaryShowing,
  newTagSaving,
  value,
  speechSrc,
  onClickMark,
  onClickBlock,
  distractionFree,
  isDictionaryLoading,
  onToggleDictionary,
  requestSpeech,
  isSpeechLoading,
  onDiscardSpeech,
  saving,
  onDelete,
  selectedText,
  requestDictionary,
  insertTag,
  createNewTag,
  tags,
  insertEmoji,
  dictionaryResults
}: {
  shortcutSearch: Option<string>;
  isDictionaryShowing: boolean;
  newTagSaving: boolean;
  value: Value;
  speechSrc: string;
  onClickMark: (type: any) => any;
  onClickBlock: (type: any) => any;
  distractionFree: boolean;
  isDictionaryLoading: boolean;
  onToggleDictionary: () => any;
  requestSpeech: () => any;
  isSpeechLoading: boolean;
  onDiscardSpeech: () => any;
  saving: boolean;
  onDelete: () => any;
  selectedText: Option<string>;
  requestDictionary: () => any;
  insertTag: (tag: string) => any;
  tags: Tag[];
  createNewTag: () => any;
  insertEmoji: (emoji: Emoji) => any;
  dictionaryResults: DictionaryResult[];
}) {
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

  const renderMarkButton = (type: MarkType, shortcutNumber: number) => {
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
  const renderBlockButton = (type: BlockType, shortcutNumber: number) => {
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
          {renderMarkButton("code", 5)}
          {renderBlockButton("block-quote", 6)}
          {renderMarkButton("bold", 7)}
          {renderMarkButton("italic", 8)}
          {renderMarkButton("underlined", 9)}
          <ButtonSpacer small>
            <EmojiToggle
              isActive={isEmojiShortcut || isEmojiButtonPressed}
              onClick={() => setIsEmojiButtonPressed(!isEmojiButtonPressed)}
            />
          </ButtonSpacer>
        </Flex>
        <Flex alignItems="center">
          <ButtonSpacer small>
            <DictionaryButton
              isLoading={isDictionaryLoading}
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
                  tags={tags.map(t => t.tag)}
                  search={shortcutSearch
                    .flatMap(removeFirstLetterFromString)
                    .getOrElse("")}
                  newTagSaving={newTagSaving}
                />
              ) : isEmojiButtonPressed || isEmojiShortcut ? (
                <EmojiList
                  onEmojiSelected={insertEmoji}
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
