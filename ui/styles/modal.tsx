import * as React from "react";
import { spacing, color, borderRadius } from "./theme";
import styled from "styled-components";
import styledTs from "styled-components-ts";
import { Clear } from "styled-icons/material";

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
  transition: all 333ms ease-in-out;
  transform: scale(${props => (props.open ? "1, 1" : "0.95, 0.95")});
  border-radius: ${borderRadius._6};
`;

const ModalCloseWrapper = styled.div`
  margin-bottom: ${spacing._1};
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
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
          <ModalCloseWrapper>
            <Clear
              height="25"
              width="25"
              fill={color.jumbo}
              onClick={onClose}
            />
          </ModalCloseWrapper>
        ) : null}
        {children}
      </ModalWrapper>
    </ModalOuter>
  );
}
