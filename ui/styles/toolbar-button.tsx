import * as React from "react";
import { styled } from "../theming/styled";
import { RoundButton } from "./button";
import { spacing, borderRadius, size, font } from "../theming/symbols";

const Button = styled(RoundButton)<{ shortcutShowing }>`
  position: relative;
  height: ${spacing._1};
  padding-left: ${props =>
    props.shortcutShowing ? spacing._0_5 : spacing._0_25};
  margin-right: ${spacing._0_125};
  transition: all 333ms ease;
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
  top: 50%;
  left: 0;
  font-weight: bold;
  transition: all 333ms ease;
  transform: translateY(-50%)
    translateX(${props => (props.showing ? spacing._0_125 : "-50%")});
  border-radius: ${borderRadius._4};
  color: ${props =>
    props.isActive
      ? props.theme.toolbarButtonActiveText
      : props.theme.toolbarButtonInactiveText};
  font-size: ${font._8.size};
  line-height: ${font._8.size};
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
