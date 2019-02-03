import * as React from "react";
import { spacing, color, media } from "./theme";
import styled from "styled-components";
import { Flex } from "@rebass/grid";
import { Wrapper } from "./wrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SidebarWrapper = styled.div<{ open: boolean }>`
  position: fixed;
  z-index: 10;
  right: 0;
  top: 0;
  height: 100%;
  max-width: 300px;
  min-width: 100px;
  width: 80%;
  background: black;
  transition: all 300ms ease;
  transform: translateX(${props => (props.open ? "0px" : "10px")});
  opacity: ${props => (props.open ? "1" : "0")};
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.open ? "normal" : "none")};
`;

export const SidebarItem = styled(Wrapper)`
  padding-top: ${spacing._0_5};
  padding-bottom: ${spacing._0_5};
  overflow: hidden;
  display: flex;
  margin: 0;
  @media (min-width: ${media.tablet}) {
    padding-left: ${spacing._1};
  }
`;

const SidebarCloseItem = styled(SidebarItem)`
  flex: 0 0 auto;
  justify-content: flex-end;

  @media (min-width: ${media.tablet}) {
    padding-right: ${spacing._2};
  }
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
      <SidebarCloseItem onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} color={color.jumbo} />
      </SidebarCloseItem>
      <Flex flex="1" flexDirection="column" style={{ overflow: "auto" }}>
        {children}
      </Flex>
    </SidebarWrapper>
  );
}
