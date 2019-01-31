import * as React from "react";
import styled from "styled-components";
import { spacing, color, borderRadius, font } from "./theme";
import { Box } from "grid-styled";
import {
  IconDefinition,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DropdownMenu = styled.div<{ showing: boolean }>`
  position: absolute;
  left: 50%;
  top: 100%;
  z-index: 10;
  margin-top: ${spacing._0_5};
  background: ${color.black};
  border-radius: ${borderRadius._6};
  opacity: ${props => (props.showing ? 1 : 0)};
  transition: all 300ms ease;
  pointer-events: ${props => (props.showing ? "unset" : "none")};
  transform: translateY(${props => (props.showing ? `0` : "-10px")})
    translateX(-50%);
  padding: ${spacing._0_5} 0;
  a {
    text-decoration: none;
  }
`;

const DropdownMenuItemWrap = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing._0_5} ${spacing._1};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  font-weight: 600;
  white-space: nowrap;
  cursor: ${props => (props.onClick ? "pointer" : "inherit")};
  color: ${color.iron};
`;

const DropdownMenuItemIcon = styled.div`
  margin-right: ${spacing._0_5};
  width: ${spacing._0_5};
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
      <FontAwesomeIcon icon={faChevronDown} />
    </DropdownChevronWrap>
  );
}
