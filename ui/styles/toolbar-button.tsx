import * as React from "react";
import { styled } from "../theming/styled";
import { RoundButton } from "./button";
import { spacing, borderRadius, font } from "../theming/symbols";

const Button = styled(RoundButton)<{ shortcutShowing }>`
  position: relative;
  width: ${spacing._1};
  height: ${spacing._1};
  margin-right: ${spacing._0_125};
  font-size: ${props =>
    props.shortcutShowing ? font._10.size : font._12.size};
  line-height: ${font._12.size};
  transition: all 333ms ease;
  padding-top: ${props =>
    props.shortcutShowing ? spacing._0_5 : spacing._0_25};
  background: ${props =>
    props.isActive
      ? props.theme.toolbarButtonActiveBackground
      : props.theme.toolbarButtonInactiveBackground};
  color: ${props =>
    props.isActive
      ? props.theme.toolbarButtonActiveText
      : props.theme.toolbarButtonInactiveText};
  border-radius: ${borderRadius._6};
  &:hover {
    background: ${props =>
      props.isActive
        ? props.theme.toolbarButtonActiveBackground
        : props.theme.toolbarButtonHoverBackground};
  }
`;

const ShortcutNumber = styled.div<{ isActive: boolean; showing: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  font-weight: 900;
  transition: all 250ms ease-in-out;
  transform: ${props =>
    props.showing
      ? `translateX(-50%) translateY(33%) scale(1, 1)`
      : `translateX(-50%) translateY(0%) scale(0, 0)`};
  border-radius: ${borderRadius._4};
  color: ${props =>
    props.isActive
      ? props.theme.toolbarButtonActiveText
      : props.theme.toolbarButtonInactiveText};
  font-size: ${font._8.size};
  line-height: ${font._8.size};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.showing ? 1 : 0)};
`;

export function ToolbarButton({
  children,
  onMouseDown,
  isActive,
  shortcutNumber,
  shortcutShowing
}: {
  children: React.ReactNode;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  isActive: boolean;
  shortcutNumber: number;
  shortcutShowing: boolean;
}) {
  return (
    <Button
      onMouseDown={onMouseDown}
      isActive={isActive}
      shortcutShowing={shortcutShowing}
    >
      <ShortcutNumber isActive={isActive} showing={shortcutShowing}>
        {shortcutNumber}
      </ShortcutNumber>
      {children}
    </Button>
  );
}