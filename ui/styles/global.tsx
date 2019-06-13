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
        open={!!store.state.rest.confirmation}
        onClose={() => store.actions.rest.setConfirmation(null)}
      >
        <>
          <Box mb={spacing._1}>
            {store.state.rest.confirmation
              ? store.state.rest.confirmation.message
              : "Are you sure?"}
          </Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={() => {
                  if (store.state.rest.confirmation.onCancel) {
                    store.state.rest.confirmation.onCancel();
                  } else {
                    store.actions.rest.setConfirmation(null);
                  }
                }}
                secondary
                fullWidth
                loading={
                  store.state.rest.confirmation &&
                  store.state.rest.confirmation.cancelLoading
                }
              >
                {store.state.rest.confirmation &&
                store.state.rest.confirmation.cancelButtonText
                  ? store.state.rest.confirmation.cancelButtonText
                  : "Cancel"}
              </Button>
            </Box>
            <Box flex={1} ml={spacing._0_25}>
              <Button
                onClick={
                  store.state.rest.confirmation
                    ? store.state.rest.confirmation.onConfirm
                    : undefined
                }
                secondary
                fullWidth
                loading={
                  store.state.rest.confirmation &&
                  store.state.rest.confirmation.confirmLoading
                }
              >
                {store.state.rest.confirmation &&
                store.state.rest.confirmation.confirmButtonText
                  ? store.state.rest.confirmation.confirmButtonText
                  : "Yes"}
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <DarkOverlay showing={!!store.state.rest.confirmation} />
    </>
  );
}
