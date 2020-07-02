import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@rebass/grid";
import React from "react";
import { Collapse } from "react-collapse";
import styled from "styled-components";

import { borderRadius, font, spacing } from "../theming/symbols";

export const DropdownMenuContainer = styled.div<{
  showing?: boolean;
  horizontalPosition?: "center" | "right";
  verticalPosition?: "top" | "bottom";
}>`
  position: absolute;
  left: ${(props) => (props.horizontalPosition === "center" ? "50%" : "auto")};
  right: ${(props) => (props.horizontalPosition === "right" ? "0" : "auto")};
  top: ${(props) => (props.verticalPosition === "bottom" ? "100%" : "auto")};
  bottom: ${(props) => (props.verticalPosition === "top" ? "100%" : "auto")};
  z-index: 10;
  margin-top: ${spacing._0_5};
  background-color: ${(props) => props.theme.dropdownMenuBackground};
  border-radius: ${borderRadius._6};
  opacity: ${(props) => (props.showing ? 1 : 0)};
  transition: all 300ms ease;
  pointer-events: ${(props) => (props.showing ? "unset" : "none")};
  transform: translateY(${(props) => (props.showing ? `0` : "-10px")})
    translateX(
      ${(props) => (props.horizontalPosition === "center" ? "-50%" : "0")}
    );
  padding: ${spacing._0_5} 0;
  a {
    text-decoration: none;
    color: inherit;
  }
`;

export function DropdownMenu({
  className = "",
  children,
  showing,
  horizontalPosition = "center",
  verticalPosition = "bottom",
}: {
  className?: string;
  children: React.ReactNode;
  showing?: boolean;
  horizontalPosition?: "center" | "right";
  verticalPosition?: "top" | "bottom";
}) {
  return (
    <DropdownMenuContainer
      showing={showing}
      horizontalPosition={horizontalPosition}
      verticalPosition={verticalPosition}
      className={className}
    >
      <Collapse isOpened={true}>{children}</Collapse>
    </DropdownMenuContainer>
  );
}

const DropdownMenuItemIcon = styled.div`
  margin-right: ${spacing._0_5};
  width: ${spacing._0_5};
  opacity: 0.5;
  transition: opacity 150ms ease;
  text-align: center;
`;

export const DropdownMenuItemWrap = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: ${spacing._0_5} ${spacing._1};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) => props.theme.dropdownMenuItemText};
  cursor: pointer;
  &:hover {
    ${DropdownMenuItemIcon} {
      opacity: 1;
    }
  }
`;

export function DropdownMenuItem({
  children,
  icon,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => any;
  className?: string;
}) {
  return (
    <DropdownMenuItemWrap onClick={onClick} className={className}>
      <DropdownMenuItemIcon>{icon ? icon : null}</DropdownMenuItemIcon>
      {children}
    </DropdownMenuItemWrap>
  );
}

export const DropdownMenuSpacer = styled.div<{ withoutMargin?: boolean }>`
  border-bottom: solid 1px ${(props) => props.theme.dropdownMenuSpacerBorder};
  margin: ${(props) => (props.withoutMargin ? "0" : spacing._0_5)} 0;
`;

const DropdownChevronWrap = styled.div`
  display: flex;
  align-items: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  font-weight: 600;
  cursor: ${(props) => (props.onClick ? "pointer" : "inherit")};
`;

const ChevronIcon = styled.div`
  font-size: ${font._8.size};
`;

export function DropdownChevron({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => any;
}) {
  return (
    <DropdownChevronWrap onClick={onClick}>
      <Box mr={spacing._0_25}>{children}</Box>
      <ChevronIcon>
        <FontAwesomeIcon icon={faChevronDown} />
      </ChevronIcon>
    </DropdownChevronWrap>
  );
}
