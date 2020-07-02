import { Box, Flex } from "@rebass/grid";
import React from "react";
import styled from "styled-components";

import { spacing } from "../theming/symbols";
import { Button } from "./button";
import { Modal } from "./modal";

const DarkOverlay = styled.div<{ showing?: boolean }>`
  position: fixed;
  z-index: 9;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: ${(props) => props.theme.modalBackdropBackground};
  transition: all 300ms ease;
  opacity: ${(props) => (props.showing ? "1" : "0")};
  pointer-events: none;
`;

export function Global() {
  const confirmation = {
    onCancel: () => void null,
    onConfirm: () => void null,
    cancelLoading: false,
    confirmLoading: false,
    cancelButtonText: "",
    confirmButtonText: "",
    message: "",
  };
  const setConfirmation = (_arg: any) => void null;

  return (
    <>
      <Modal
        open={!!confirmation && false}
        onClose={() => setConfirmation(null)}
      >
        <>
          <Box mb={spacing._1}>
            {confirmation && confirmation.message
              ? confirmation.message
              : "Are you sure?"}
          </Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={() => {
                  if (confirmation.onCancel) {
                    confirmation.onCancel();
                  } else {
                    setConfirmation(null);
                  }
                }}
                secondary
                fullWidth
                loading={confirmation && confirmation.cancelLoading}
              >
                {confirmation && confirmation.cancelButtonText
                  ? confirmation.cancelButtonText
                  : "Cancel"}
              </Button>
            </Box>
            <Box flex={1} ml={spacing._0_25}>
              <Button
                onClick={confirmation ? confirmation.onConfirm : undefined}
                secondary
                fullWidth
                loading={confirmation && confirmation.confirmLoading}
              >
                {confirmation && confirmation.confirmButtonText
                  ? confirmation.confirmButtonText
                  : "Yes"}
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <DarkOverlay showing={!!confirmation} />
    </>
  );
}
