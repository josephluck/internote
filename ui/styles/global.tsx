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
        open={!!store.state.confirmation}
        onClose={() => store.actions.setConfirmation(null)}
      >
        <>
          <Box mb={spacing._1}>
            {store.state.confirmation
              ? store.state.confirmation.message
              : "Are you sure?"}
          </Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={() => {
                  if (store.state.confirmation.onCancel) {
                    store.state.confirmation.onCancel();
                  } else {
                    store.actions.setConfirmation(null);
                  }
                }}
                secondary
                fullWidth
                loading={
                  store.state.confirmation &&
                  store.state.confirmation.cancelLoading
                }
              >
                {store.state.confirmation &&
                store.state.confirmation.cancelButtonText
                  ? store.state.confirmation.cancelButtonText
                  : "Cancel"}
              </Button>
            </Box>
            <Box flex={1} ml={spacing._0_25}>
              <Button
                onClick={
                  store.state.confirmation
                    ? store.state.confirmation.onConfirm
                    : undefined
                }
                secondary
                fullWidth
                loading={
                  store.state.confirmation &&
                  store.state.confirmation.confirmLoading
                }
              >
                {store.state.confirmation &&
                store.state.confirmation.confirmButtonText
                  ? store.state.confirmation.confirmButtonText
                  : "Yes"}
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <DarkOverlay showing={!!store.state.confirmation} />
    </>
  );
}
