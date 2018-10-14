import * as React from "react";
import { spacing, color, borderRadius, font } from "./theme";
import styled from "styled-components";
import styledTs from "styled-components-ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ModalOuter = styledTs<{ open: boolean }>(styled.div)`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  pointer-events: ${props => (props.open ? "normal" : "none")}
  opacity: ${props => (props.open ? "1" : "0")};
`;

const ModalWrapper = styledTs<{ open: boolean }>(styled.div)`
  padding: ${spacing._1};
  max-width: 400px;
  min-width: 100px;
  width: 80%;
  background: black;
  transition: all 300ms ease;
  transform: translateY(${props => (props.open ? "0px" : "-10px")});
  opacity: ${props => (props.open ? "1" : "0")};
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
`;

export function Modal({
  open,
  onClose,
  children,
  showCloseIcon = true
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseIcon?: boolean;
}) {
  return (
    <ModalOuter open={open}>
      <ModalWrapper open={open}>
        {showCloseIcon ? (
          <ModalCloseWrapper onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} color={color.jumbo} />
          </ModalCloseWrapper>
        ) : null}
        {children}
      </ModalWrapper>
    </ModalOuter>
  );
}
