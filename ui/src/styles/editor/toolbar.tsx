import { InternoteEditorNodeType } from "@internote/lib/editor-types";
import { GetSnippetDTO } from "@internote/snippets-service/types";
import { Flex } from "@rebass/grid";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import React, { useCallback } from "react";
import { Collapse } from "react-collapse";
import { Editor } from "slate";
import { useEditor } from "slate-react";
import styled from "styled-components";

import { useStately } from "../../store/store";
import { font, size, spacing } from "../../theming/symbols";
import { Emoji } from "../../utilities/emojis";
import { Dictionary } from "../dictionary";
import { DictionaryButton } from "../dictionary-button";
import { EmojiList } from "../emoji-list";
import { LinksContext } from "../links-context";
import { Saving } from "../saving";
import { Shortcut } from "../shortcuts";
import { SnippetsContext } from "../snippets-context";
import { SnippetsButton } from "../snippets-menu";
import { Speech } from "../speech";
import { TagsList } from "../tags-list";
import { ButtonSpacer, ToolbarButton } from "../toolbar-button";
import { Wrapper } from "../wrapper";
import { DeleteNoteButton } from "./delete";
import { useInternoteEditor } from "./hooks";
import {
  getHighlightedWord,
  getNodesFromEditorSelection,
  getNodesFromSlateRange,
} from "./selection";
import {
  marks,
  toolbarBlocks,
  toolbarIconMap,
  toolbarLabelMap,
  toolbarShortcutMap,
} from "./types";
import {
  extractFirstLinkFromNodes,
  extractTextFromNodes,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from "./utils";

export const Toolbar: React.FunctionComponent<{
  noteId?: string;
  saving: boolean;
}> = ({ noteId, saving }) => {
  const {
    editor,
    emojiSearchText,
    hashtagSearchText,
    replaceSmartSearchText,
    speechText,
    selectedText,
  } = useInternoteEditor();

  const {
    snippetsMenuShowing,
    setCreateSnippetModalOpen,
    setSnippetSelection,
  } = React.useContext(SnippetsContext);

  const {
    setLinkLabel,
    setLinkHref,
    setSelectedRange,
    setCreateLinkModalOpen,
  } = React.useContext(LinksContext);

  const distractionFree = useStately(
    (state) => state.preferences.distractionFree
  );

  const tags = useStately((state) => state.tags.tags);

  const isDictionaryShowing = useStately(
    (state) => state.dictionary.dictionaryShowing
  );

  const isDictionaryLoading = false;

  const [isEmojiButtonPressed, setIsEmojiButtonPressed] = React.useState(false);

  const [isTagButtonPressed, setIsTagButtonPressed] = React.useState(false);

  const isEmojiShowing = O.isSome(emojiSearchText) || isEmojiButtonPressed;

  const isHashtagShowing = O.isSome(hashtagSearchText) || isTagButtonPressed;

  const toolbarIsExpanded =
    isDictionaryShowing || isEmojiShowing || isHashtagShowing;

  const isToolbarVisible =
    toolbarIsExpanded || O.isSome(selectedText) || snippetsMenuShowing;

  const linkIsActive = isBlockActive(editor, "link");

  const selectedWord = pipe(
    getHighlightedWord(editor),
    O.getOrElse(() => "")
  );

  const toggleEmojiButtonPressed = useCallback(
    () => setIsEmojiButtonPressed((prev) => !prev),
    []
  );

  const toggleTagButtonPressed = useCallback(
    () => setIsTagButtonPressed((prev) => !prev),
    []
  );

  const handleInsertTag = useCallback(
    (tag: string) => {
      setIsTagButtonPressed(false);
      // @ts-ignore
      replaceSmartSearchText({ type: "tag", tag, children: [{ text: "" }] });
    },
    [replaceSmartSearchText]
  );

  const handleInsertEmoji = useCallback(
    (emoji: Emoji) => {
      setIsEmojiButtonPressed(false);
      replaceSmartSearchText(emoji.char);
    },
    [replaceSmartSearchText]
  );

  const handleInsertSnippet = useCallback(
    (snippet: GetSnippetDTO) => Editor.insertFragment(editor, snippet.content),
    [editor]
  );

  const handleCreateSnippet = useCallback(() => {
    pipe(
      getNodesFromEditorSelection(editor),
      O.map((nodes) => {
        setSnippetSelection(nodes);
        setCreateSnippetModalOpen(true);
      })
    );
  }, [editor]);

  const handleLinkButtonPressed = useCallback(() => {
    pipe(
      O.fromNullable(editor.selection),
      O.filterMap((range) => {
        // TODO: smart expansion of selection to include current anchor if
        // selection includes an anchor (both sides of selection)
        setSelectedRange(range);
        return getNodesFromSlateRange(editor, range);
      }),
      O.map((nodes) => {
        pipe(
          extractFirstLinkFromNodes(nodes),
          O.map((link) => link.href),
          O.map(setLinkHref)
        );
        setLinkLabel(extractTextFromNodes(nodes));
        setCreateLinkModalOpen(true);
      })
    );
  }, [editor, linkIsActive]);

  const handleEscape = useCallback(() => {
    setIsEmojiButtonPressed(false);
    setIsTagButtonPressed(false);
  }, []);

  return (
    <ToolbarWrapper
      distractionFree={distractionFree || false}
      forceShow={isToolbarVisible}
    >
      <Shortcut
        keyCombo="esc"
        callback={handleEscape}
        id="toolbar-escape"
        description="Close toolbar"
      />
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
          <ButtonSpacer small>
            <ToolbarButton
              onClick={toggleEmojiButtonPressed}
              icon={toolbarIconMap.emoji}
              label={toolbarLabelMap.emoji}
              name={toolbarLabelMap.emoji}
              shortcut={toolbarShortcutMap.emoji}
            />
          </ButtonSpacer>
          {!!noteId && (
            <ButtonSpacer small>
              <ToolbarButton
                onClick={toggleTagButtonPressed}
                icon={toolbarIconMap.tag}
                label={toolbarLabelMap.tag}
                name={toolbarLabelMap.tag}
                shortcut={toolbarShortcutMap.tag}
              />
            </ButtonSpacer>
          )}
          <ButtonSpacer small>
            <ToolbarButton
              isActive={linkIsActive}
              onClick={handleLinkButtonPressed}
              icon={toolbarIconMap.link}
              name={toolbarLabelMap.link}
              label={
                linkIsActive
                  ? toolbarLabelMap["link-edit"]
                  : toolbarLabelMap.link
              }
              shortcut={toolbarShortcutMap.link}
            />
          </ButtonSpacer>
          {!!noteId && (
            <ButtonSpacer small>
              <SnippetsButton
                hasHighlighted={pipe(selectedText, O.isSome)}
                onSnippetSelected={handleInsertSnippet}
                onCreateSnippet={handleCreateSnippet}
              />
            </ButtonSpacer>
          )}
        </Flex>
        <Flex alignItems="center">
          {!!noteId && (
            <ButtonSpacer small>
              <DictionaryButton
                isLoading={isDictionaryLoading}
                isShowing={isDictionaryShowing}
                selectedWord={selectedWord}
              />
            </ButtonSpacer>
          )}
          {!!noteId && (
            <ButtonSpacer small>
              <Speech
                selectedText={pipe(
                  speechText,
                  O.getOrElse(() => "")
                )}
                noteId={noteId}
              />
            </ButtonSpacer>
          )}
          {!!noteId && (
            <ButtonSpacer>
              <DeleteNoteButton noteId={noteId} />
            </ButtonSpacer>
          )}
          {!!noteId && <Saving saving={saving} />}
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
