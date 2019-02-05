import * as React from "react";
import styled from "styled-components";
import { spacing, color, borderRadius, font } from "./theme";
import { Box } from "@rebass/grid";
import {
  IconDefinition,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DropdownMenu = styled.div<{
  showing: boolean;
  position?: "center" | "right";
}>`
  position: absolute;
  left: ${props => (props.position === "center" ? "50%" : "auto")};
  right: ${props => (props.position === "right" ? "0" : "auto")};
  top: 100%;
  z-index: 10;
  margin-top: ${spacing._1};
  background-color: ${color.black};
  border-radius: ${borderRadius._6};
  opacity: ${props => (props.showing ? 1 : 0)};
  transition: all 300ms ease;
  pointer-events: ${props => (props.showing ? "unset" : "none")};
  transform: translateY(${props => (props.showing ? `0` : "-10px")})
    translateX(${props => (props.position === "center" ? "-50%" : "0")});
  padding: ${spacing._1} 0;
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const DropdownMenuItemIcon = styled.div`
  margin-right: ${spacing._1_5};
  width: ${spacing._1};
  opacity: 0.5;
  transition: opacity 150ms ease;
`;

const DropdownMenuItemWrap = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing._1} ${spacing._1_5};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  font-weight: 600;
  white-space: nowrap;
  color: ${color.iron};
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
  onClick
}: {
  children: React.ReactNode;
  icon: IconDefinition;
  onClick?: () => any;
}) {
  return (
    <DropdownMenuItemWrap onClick={onClick}>
      <DropdownMenuItemIcon>
        {/* TODO: add loading icon support here */}
        {icon ? <FontAwesomeIcon icon={icon} /> : null}
      </DropdownMenuItemIcon>
      {children}
    </DropdownMenuItemWrap>
  );
}

const DropdownChevronWrap = styled.div`
  display: flex;
  align-items: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  font-weight: 600;
  cursor: ${props => (props.onClick ? "pointer" : "inherit")};
`;

const ChevronIcon = styled.div`
  font-size: ${font._8.size};
`;

export function DropdownChevron({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => any;
}) {
  return (
    <DropdownChevronWrap onClick={onClick}>
      <Box mr={spacing._0_5}>{children}</Box>
      <ChevronIcon>
        <FontAwesomeIcon icon={faChevronDown} />
      </ChevronIcon>
    </DropdownChevronWrap>
  );
}
