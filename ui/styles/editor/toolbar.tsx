import { Flex } from "@rebass/grid";
import React, { useCallback } from "react";
import styled from "styled-components";
import { useTwineState } from "../../store";
import { font, size, spacing } from "../../theming/symbols";
import { ToolbarButton, ButtonSpacer } from "../toolbar-button";
import { Wrapper } from "../wrapper";
import { useInternoteEditor } from "./hooks";
import { SlateNodeType } from "./types";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";
import { NoteSavingIndicator } from "./saving";
import { DeleteNoteButton } from "./delete";
import { useMemo } from "react";
import { Collapse } from "react-collapse";
import { Dictionary } from "../dictionary";
import { DictionaryButton } from "../dictionary-button";

export const Toolbar: React.FunctionComponent<{ noteId: string }> = ({
  noteId,
}) => {
  const distractionFree = useTwineState(
    (state) => state.preferences.distractionFree
  );

  const isDictionaryShowing = useTwineState(
    (state) => state.dictionary.dictionaryShowing
  );

  const isDictionaryLoading = useTwineState(
    (state) => state.dictionary.loading.lookup
  );

  const toolbarIsExpanded = isDictionaryShowing; // TODO: derive from current state

  const isToolbarVisible = toolbarIsExpanded; // TODO: derive from current state

  const selectedText = ""; // TODO: get from state?

  return (
    <ToolbarWrapper
      distractionFree={distractionFree}
      forceShow={isToolbarVisible}
    >
      <ToolbarInner>
        <Flex flex={1}>
          <MarkButton nodeType="bold" />
          <MarkButton nodeType="italic" />
          <MarkButton nodeType="underline" />
          <MarkButton nodeType="code" />
          <BlockButton nodeType="heading-one" />
          <BlockButton nodeType="heading-two" />
          <BlockButton nodeType="block-quote" />
          <BlockButton nodeType="numbered-list" />
          <BlockButton nodeType="bulleted-list" />
        </Flex>
        <Flex alignItems="center">
          <ButtonSpacer>
            <DictionaryButton
              isLoading={isDictionaryLoading}
              isShowing={isDictionaryShowing}
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
              {isDictionaryShowing ? (
                <Dictionary
                  isLoading={isDictionaryLoading}
                  requestedWord={selectedText}
                />
              ) : null}
            </ToolbarInner>
          </ToolbarExpandedInner>
        </ToolbarExpandedWrapper>
      </Collapse>
    </ToolbarWrapper>
  );
};

const BlockButton: React.FunctionComponent<{ nodeType: SlateNodeType }> = ({
  nodeType,
}) => {
  const editor = useInternoteEditor();

  const handleToggle = useCallback(() => {
    toggleBlock(editor, nodeType);
  }, [editor, nodeType]);

  const isActive = useMemo(() => isBlockActive(editor, nodeType), [
    editor,
    nodeType,
  ]);

  return (
    <ToolbarButton
      nodeType={nodeType}
      isActive={isActive}
      shortcutNumber={1}
      onClick={handleToggle}
    />
  );
};

const MarkButton: React.FunctionComponent<{ nodeType: SlateNodeType }> = ({
  nodeType,
}) => {
  const editor = useInternoteEditor();

  const handleToggle = useCallback(() => {
    toggleMark(editor, nodeType);
  }, [editor, nodeType]);

  const isActive = useMemo(() => isMarkActive(editor, nodeType), [
    editor,
    nodeType,
  ]);

  return (
    <ToolbarButton
      nodeType={nodeType}
      isActive={isActive}
      shortcutNumber={1}
      onClick={handleToggle}
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
