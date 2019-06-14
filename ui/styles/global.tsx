import * as React from "react";
import { spacing } from "../theming/symbols";
import { styled } from "../theming/styled";
import { Store } from "../store";
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

export function Global({ store }: { store: Store }) {
  return (
    <>
      <Modal
        open={!!store.state.confirmation.confirmation}
        onClose={() => store.actions.confirmation.setConfirmation(null)}
      >
        <>
          <Box mb={spacing._1}>
            {store.state.confirmation.confirmation
              ? store.state.confirmation.confirmation.message
              : "Are you sure?"}
          </Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={() => {
                  if (store.state.confirmation.confirmation.onCancel) {
                    store.state.confirmation.confirmation.onCancel();
                  } else {
                    store.actions.confirmation.setConfirmation(null);
                  }
                }}
                secondary
                fullWidth
                loading={
                  store.state.confirmation.confirmation &&
                  store.state.confirmation.confirmation.cancelLoading
                }
              >
                {store.state.confirmation.confirmation &&
                store.state.confirmation.confirmation.cancelButtonText
                  ? store.state.confirmation.confirmation.cancelButtonText
                  : "Cancel"}
              </Button>
            </Box>
            <Box flex={1} ml={spacing._0_25}>
              <Button
                onClick={
                  store.state.confirmation.confirmation
                    ? store.state.confirmation.confirmation.onConfirm
                    : undefined
                }
                secondary
                fullWidth
                loading={
                  store.state.confirmation.confirmation &&
                  store.state.confirmation.confirmation.confirmLoading
                }
              >
                {store.state.confirmation.confirmation &&
                store.state.confirmation.confirmation.confirmButtonText
                  ? store.state.confirmation.confirmation.confirmButtonText
                  : "Yes"}
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <DarkOverlay showing={!!store.state.confirmation.confirmation} />
    </>
  );
}
