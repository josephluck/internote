import * as React from "react";
import { spacing } from "../theming/symbols";
import { styled } from "../theming/styled";
import { useTwineState, useTwineActions } from "../store";
import { Modal } from "./modal";
import { Button } from "./button";
import { Flex, Box } from "@rebass/grid";

const DarkOverlay = styled.div<{ showing: boolean }>`
  position: fixed;
  z-index: 9;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: ${props => props.theme.modalBackdropBackground};
  transition: all 300ms ease;
  opacity: ${props => (props.showing ? "0.9" : "0")};
  pointer-events: none;
`;

export function Global() {
  const confirmation = useTwineState(state => state.confirmation.confirmation);
  const setConfirmation = useTwineActions(
    actions => actions.confirmation.setConfirmation
  );

  return (
    <>
      <Modal open={!!confirmation} onClose={() => setConfirmation(null)}>
        <>
          <Box mb={spacing._1}>
            {confirmation ? confirmation.message : "Are you sure?"}
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
