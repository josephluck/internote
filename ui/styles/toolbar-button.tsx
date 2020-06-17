import {
  faBold,
  faBook,
  faCode,
  faEye,
  faHeading,
  faItalic,
  faListOl,
  faListUl,
  faMicrophone,
  faPlay,
  faQuoteLeft,
  faSpinner,
  faUnderline,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@rebass/grid";
import React, { useCallback } from "react";
import styled from "styled-components";
import { borderRadius, font, spacing } from "../theming/symbols";
import { RoundButton } from "./button";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { InternoteEditorNodeType } from "./editor/types";

export const ToolbarButton: React.FunctionComponent<{
  onClick?: (event: React.MouseEvent) => void;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  isActive?: boolean;
  shortcutNumber?: number;
  shortcutShowing?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  forceExpand?: boolean;
}> = ({
  onClick,
  stopPropagation = true,
  preventDefault = true,
  isActive,
  shortcutNumber,
  shortcutShowing = false,
  forceExpand = false,
  icon,
  label,
}) => {
  // TODO: support shortcuts that trigger handleMouseDown
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      if (onClick) onClick(event);
    },
    [onClick, preventDefault, stopPropagation]
  );

  return (
    <CollapseWidthOnHover
      onMouseDown={handleMouseDown}
      forceShow={forceExpand}
      collapsedContent={<Flex pl={spacing._0_25}>{label}</Flex>}
    >
      {(collapse) => (
        <ToolbarExpandingButton
          isActive={isActive}
          forceShow={forceExpand}
          shortcutShowing={shortcutShowing}
        >
          <ShortcutNumber isActive={isActive} showing={shortcutShowing}>
            {shortcutNumber}
          </ShortcutNumber>
          <ToolbarExpandingButtonIconWrap>
            {icon}
          </ToolbarExpandingButtonIconWrap>
          {collapse.renderCollapsedContent()}
        </ToolbarExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
};

export const ToolbarExpandingButton = styled(RoundButton)<{
  forceShow?: boolean;
  isActive?: boolean;
  shortcutShowing?: boolean;
}>`
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  border-radius: ${borderRadius._6};
  padding: ${spacing._0_25};
  height: ${spacing._1};
  font-weight: 600;
  font-size: ${(props) =>
    props.shortcutShowing ? font._10.size : font._12.size};
  padding-top: ${(props) =>
    props.shortcutShowing ? spacing._0_5 : spacing._0_25};
  color: ${(props) =>
    props.isActive
      ? props.theme.toolbarButtonActiveText
      : props.forceShow
      ? props.theme.expandingIconButtonActiveText
      : props.theme.expandingIconButtonInactiveText};
  background: ${(props) =>
    props.isActive
      ? props.theme.toolbarButtonActiveBackground
      : props.forceShow
      ? props.theme.expandingIconButtonBackground
      : "transparent"};
  &:hover {
    color: ${(props) =>
      props.isActive
        ? props.theme.toolbarButtonActiveText
        : props.theme.expandingIconButtonActiveText};
    background: ${(props) =>
      props.isActive
        ? props.theme.toolbarButtonActiveBackground
        : props.theme.expandingIconButtonBackground};
  }
`;

export const ToolbarExpandingButtonIconWrap = styled.div`
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ShortcutNumber = styled.div<{ isActive: boolean; showing: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  font-weight: 900;
  transition: all 250ms ease-in-out;
  transform: ${(props) =>
    props.showing
      ? `translateX(-50%) translateY(33%) scale(1, 1)`
      : `translateX(-50%) translateY(0%) scale(0, 0)`};
  border-radius: ${borderRadius._4};
  color: ${(props) =>
    props.isActive
      ? props.theme.toolbarButtonActiveText
      : props.theme.toolbarButtonInactiveText};
  font-size: ${font._8.size};
  line-height: ${font._8.size};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.showing ? 1 : 0)};
`;

export const ButtonSpacer = styled.div<{ small?: boolean }>`
  margin-right: ${(props) => (props.small ? spacing._0_125 : spacing._0_4)};
`;

type ToolbarFunctions =
  | "outline"
  | "speech"
  | "speech-loading"
  | "speech-playing"
  | "speech-paused"
  | "dictionary"
  | "dictionary-loading";

export type ToolbarIconType = InternoteEditorNodeType | ToolbarFunctions;

export const toolbarIconMap: Partial<Record<
  ToolbarIconType,
  React.ReactNode
>> = {
  bold: <FontAwesomeIcon icon={faBold} />,
  italic: <FontAwesomeIcon icon={faItalic} />,
  underline: <FontAwesomeIcon icon={faUnderline} />,
  code: <FontAwesomeIcon icon={faCode} />,
  "heading-one": <FontAwesomeIcon icon={faHeading} />,
  "heading-two": "H2", // TODO: find an icon for representing heading-two
  "block-quote": <FontAwesomeIcon icon={faQuoteLeft} />,
  "bulleted-list": <FontAwesomeIcon icon={faListUl} />,
  "numbered-list": <FontAwesomeIcon icon={faListOl} />,
  outline: <FontAwesomeIcon icon={faEye} />,
  dictionary: <FontAwesomeIcon icon={faBook} />,
  "dictionary-loading": <FontAwesomeIcon icon={faSpinner} spin />,
  speech: <FontAwesomeIcon icon={faMicrophone} />,
  "speech-loading": <FontAwesomeIcon icon={faSpinner} spin />,
  "speech-playing": <FontAwesomeIcon icon={faPause} />,
  "speech-paused": <FontAwesomeIcon icon={faPlay} />,
};
