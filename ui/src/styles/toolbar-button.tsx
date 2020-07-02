import { Flex } from "@rebass/grid";
import React, { useCallback } from "react";
import styled from "styled-components";

import { borderRadius, font, spacing } from "../theming/symbols";
import { RoundButton } from "./button";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Shortcut } from "./shortcuts";

export const ToolbarButton: React.FunctionComponent<{
  onClick?: () => void;
  isActive?: boolean;
  shortcutNumber?: number;
  shortcutShowing?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  forceExpand?: boolean;
  shortcut?: string | string[];
  name?: string;
}> = ({
  onClick,
  isActive,
  shortcutNumber,
  shortcutShowing = false,
  forceExpand = false,
  icon,
  label,
  shortcut,
  name,
}) => {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      if (onClick) {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <>
      {!!shortcut && !!name && !!onClick && (
        <Shortcut
          id={name}
          description={name}
          keyCombo={shortcut}
          callback={onClick}
        />
      )}
      <CollapseWidthOnHover
        onMouseDown={handleMouseDown}
        forceShow={forceExpand}
        collapsedContent={
          <CollapsedContentWrap pl={spacing._0_25}>
            {label}
          </CollapsedContentWrap>
        }
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
    </>
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

const CollapsedContentWrap = styled(Flex)`
  white-space: nowrap;
`;

const ShortcutNumber = styled.div<{ isActive?: boolean; showing?: boolean }>`
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
