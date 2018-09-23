import * as React from "react";
import { spacing, color } from "./theme";
import styled from "styled-components";
import styledTs from "styled-components-ts";
import { Clear } from "styled-icons/material";

const SidebarWrapper = styledTs<{ open: boolean }>(styled.div)`
  position: fixed;
  z-index: 10;
  right: 0;
  top: 0;
  height: 100%;
  max-width: 300px;
  min-width: 100px;
  width: 80%;
  background: black;
  transition: all 333ms ease;
  transform: translateX(${props => (props.open ? "0%" : "100%")});
  opacity: ${props => (props.open ? "1" : "0")};
`;

export const SidebarItem = styled.div`
  padding: ${spacing._0_5} ${spacing._1};
  overflow: hidden;
  display: flex;
`;

const SidebarCloseItem = SidebarItem.extend`
  justify-content: flex-end;
  padding-right: ${spacing._2};
`;

export function Sidebar({
  open,
  onClose,
  children
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <SidebarWrapper open={open}>
      <SidebarCloseItem>
        <Clear height="25" width="25" fill={color.jumbo} onClick={onClose} />
      </SidebarCloseItem>
      {children}
    </SidebarWrapper>
  );
}
