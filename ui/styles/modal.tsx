import React from "react";
import { spacing, borderRadius, font } from "../theming/symbols";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ModalOuter = styled.div<{ open: boolean; withBackground: boolean }>`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  pointer-events: ${(props) => (props.open ? "normal" : "none")};
  opacity: ${(props) => (props.open ? "1" : "0")};
  background: ${(props) =>
    props.withBackground ? props.theme.modalBackdropBackground : "transparent"};
`;

const ModalWrapper = styled.div<{ open: boolean }>`
  padding: ${spacing._1};
  max-width: 400px;
  min-width: 100px;
  width: 80%;
  background: ${(props) => props.theme.modalBackground};
  transition: all 300ms ease;
  transform: translateY(${(props) => (props.open ? "0px" : "-10px")});
  opacity: ${(props) => (props.open ? "1" : "0")};
  border-radius: ${borderRadius._6};
  font-size: ${font._28.size};
`;

const ModalCloseWrapper = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 100%;
  left: 100%;
  margin-bottom: ${spacing._0_5};
  margin-left: ${spacing._0_5};
  color: ${(props) => props.theme.modalCloseIconColor};
`;

export function Modal({
  open,
  onClose,
  children,
  showCloseIcon = true,
  withOverlay = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseIcon?: boolean;
  withOverlay?: boolean;
}) {
  return (
    <ModalOuter open={open} withBackground={withOverlay}>
      <ModalWrapper open={open}>
        {showCloseIcon ? (
          <ModalCloseWrapper onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </ModalCloseWrapper>
        ) : null}
        {children}
      </ModalWrapper>
    </ModalOuter>
  );
}
