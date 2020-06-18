import { Flex } from "@rebass/grid";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import React, { useCallback } from "react";
import { Collapse } from "react-collapse";
import { useEditor } from "slate-react";
import styled from "styled-components";
import { useTwineState } from "../../store";
import { font, size, spacing } from "../../theming/symbols";
import { Emoji } from "../../utilities/emojis";
import { Dictionary } from "../dictionary";
import { DictionaryButton } from "../dictionary-button";
import { EmojiList } from "../emoji-list";
import { Speech } from "../speech";
import { TagsList } from "../tags-list";
import { ButtonSpacer, ToolbarButton } from "../toolbar-button";
import { Wrapper } from "../wrapper";
import { DeleteNoteButton } from "./delete";
import { useInternoteEditor } from "./hooks";
import { NoteSavingIndicator } from "./saving";
import { getHighlightedWord } from "./selection";
import {
  InternoteEditorNodeType,
  marks,
  toolbarBlocks,
  toolbarIconMap,
  toolbarLabelMap,
  toolbarShortcutMap,
} from "./types";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";

export const Toolbar: React.FunctionComponent<{ noteId: string }> = ({
  noteId,
}) => {
  const {
    editor,
    emojiSearchText,
    hashtagSearchText,
    hasSmartSearch,
    replaceSmartSearchText,
    speechText,
    selectedText,
  } = useInternoteEditor();

  const distractionFree = useTwineState(
    (state) => state.preferences.distractionFree
  );

  const tags = useTwineState((state) => state.tags.tags);

  const isDictionaryShowing = useTwineState(
    (state) => state.dictionary.dictionaryShowing
  );

  const isDictionaryLoading = useTwineState(
    (state) => state.dictionary.loading.lookup
  );

  const isEmojiShowing = O.isSome(emojiSearchText);

  const isHashtagShowing = O.isSome(hashtagSearchText);

  const toolbarIsExpanded = isDictionaryShowing || hasSmartSearch;

  const isToolbarVisible = toolbarIsExpanded || O.isSome(selectedText);

  const selectedWord = pipe(
    getHighlightedWord(editor),
    O.getOrElse(() => "")
  );

  const handleInsertTag = useCallback(
    (tag: string) => {
      replaceSmartSearchText({ type: "tag", tag, children: [{ text: "" }] });
    },
    [replaceSmartSearchText]
  );

  const handleInsertEmoji = useCallback(
    (emoji: Emoji) => {
      replaceSmartSearchText(emoji.char);
    },
    [replaceSmartSearchText]
  );

  return (
    <ToolbarWrapper
      distractionFree={distractionFree}
      forceShow={isToolbarVisible}
    >
      <ToolbarInner>
        <Flex flex={1} alignItems="center">
          {marks.map((mark) => (
            <ButtonSpacer small key={mark}>
              <MarkButton nodeType={mark} />
            </ButtonSpacer>
          ))}
          {toolbarBlocks.map((block) => (
            <ButtonSpacer small key={block}>
              <BlockButton nodeType={block} />
            </ButtonSpacer>
          ))}
        </Flex>
        <Flex alignItems="center">
          <ButtonSpacer small>
            <DictionaryButton
              isLoading={isDictionaryLoading}
              isShowing={isDictionaryShowing}
              selectedWord={selectedWord}
            />
          </ButtonSpacer>
          <ButtonSpacer small>
            <Speech
              selectedText={pipe(
                speechText,
                O.getOrElse(() => "")
              )}
              noteId={noteId}
            />
          </ButtonSpacer>
          <ButtonSpacer>
            <DeleteNoteButton noteId={noteId} />
          </ButtonSpacer>
          <NoteSavingIndicator />
        </Flex>
      </ToolbarInner>
      <Collapse isOpened={toolbarIsExpanded}>
        <ToolbarExpandedWrapper>
          <ToolbarExpandedInner>
            <ToolbarInner>
              {isHashtagShowing ? (
                <TagsList
                  tags={tags}
                  search={pipe(
                    hashtagSearchText,
                    O.getOrElse(() => "")
                  )}
                  onCreateNewTag={handleInsertTag}
                  newTagSaving={false}
                  onTagSelected={handleInsertTag}
                />
              ) : isEmojiShowing ? (
                <EmojiList
                  onEmojiSelected={handleInsertEmoji}
                  search={pipe(
                    emojiSearchText,
                    O.getOrElse(() => "")
                  )}
                />
              ) : isDictionaryShowing ? (
                <Dictionary
                  isLoading={isDictionaryLoading}
                  selectedWord={selectedWord}
                />
              ) : null}
            </ToolbarInner>
          </ToolbarExpandedInner>
        </ToolbarExpandedWrapper>
      </Collapse>
    </ToolbarWrapper>
  );
};

const BlockButton: React.FunctionComponent<{
  nodeType: InternoteEditorNodeType;
}> = ({ nodeType }) => {
  const editor = useEditor();

  const handleToggle = useCallback(() => {
    toggleBlock(editor, nodeType);
  }, [editor, nodeType]);

  const isActive = isBlockActive(editor, nodeType);

  return (
    <ToolbarButton
      isActive={isActive}
      onClick={handleToggle}
      icon={toolbarIconMap[nodeType]}
      label={toolbarLabelMap[nodeType]}
      name={toolbarLabelMap[nodeType]}
      shortcut={toolbarShortcutMap[nodeType]}
    />
  );
};

const MarkButton: React.FunctionComponent<{
  nodeType: InternoteEditorNodeType;
}> = ({ nodeType }) => {
  const editor = useEditor();

  const handleToggle = useCallback(() => {
    toggleMark(editor, nodeType);
  }, [editor, nodeType]);

  const isActive = isMarkActive(editor, nodeType);

  return (
    <ToolbarButton
      isActive={isActive}
      onClick={handleToggle}
      icon={toolbarIconMap[nodeType]}
      label={toolbarLabelMap[nodeType]}
      name={toolbarLabelMap[nodeType]}
      shortcut={toolbarShortcutMap[nodeType]}
    />
  );
};

export const ToolbarWrapper = styled.div<{
  distractionFree: boolean;
  forceShow: boolean;
}>`
  flex: 0 0 auto;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  background: ${(props) => props.theme.toolbarBackground};
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: ${spacing._0_25} 0;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 500ms ease;
  opacity: ${(props) => (props.distractionFree && !props.forceShow ? 0 : 1)};
  transform: ${(props) =>
    props.distractionFree && !props.forceShow
      ? "translateY(5px)"
      : "translateY(0px)"};
  z-index: 5;
  &:hover {
    opacity: 1;
    transform: translateY(0px);
    transition: all 200ms ease;
  }
`;

export const ToolbarInner = styled(Wrapper)`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
`;

export const ToolbarExpandedWrapper = styled.div`
  padding-top: ${spacing._0_25};
  overflow: hidden;
  width: 100%;
`;

export const ToolbarExpandedInner = styled.div`
  border-top: solid 1px ${(props) => props.theme.dropdownMenuSpacerBorder};
  padding-top: ${spacing._0_25};
  overflow: auto;
  max-height: ${size.toolbarExpandedMaxHeight};
`;
