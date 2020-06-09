import { Flex } from "@rebass/grid";
import React from "react";
import styled from "styled-components";
import { useTwineState } from "../../store";
import { font, size, spacing } from "../../theming/symbols";
import { ToolbarButton } from "../toolbar-button";
import { Wrapper } from "../wrapper";
import { useInternoteEditor } from "./hooks";
import { SlateNodeType } from "./types";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";

export const Toolbar: React.FunctionComponent<{}> = ({}) => {
  const distractionFree = useTwineState(
    (state) => state.preferences.distractionFree
  );
  const isToolbarShowing = true; // TODO: derive from current state etc

  return (
    <ToolbarWrapper
      distractionFree={distractionFree}
      forceShow={isToolbarShowing}
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
      </ToolbarInner>
    </ToolbarWrapper>
  );
};

const BlockButton: React.FunctionComponent<{ nodeType: SlateNodeType }> = ({
  nodeType,
}) => {
  const editor = useInternoteEditor();
  return (
    <ToolbarButton
      nodeType={nodeType}
      isActive={isBlockActive(editor, nodeType)}
      shortcutNumber={1}
      onClick={() => toggleBlock(editor, nodeType)}
    />
  );
};

const MarkButton: React.FunctionComponent<{ nodeType: SlateNodeType }> = ({
  nodeType,
}) => {
  const editor = useInternoteEditor();
  return (
    <ToolbarButton
      nodeType={nodeType}
      isActive={isMarkActive(editor, nodeType)}
      shortcutNumber={1}
      onClick={() => toggleMark(editor, nodeType)}
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
