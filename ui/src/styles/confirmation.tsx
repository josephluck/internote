import { Box, Flex } from "@rebass/grid";
import React, { useCallback, useContext, useState } from "react";
import styled from "styled-components";

import { spacing } from "../theming/symbols";
import { Button } from "./button";
import { Modal } from "./modal";

type Confirmation = {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
  message?: string;
};

type IConfirmationContext = {
  confirmation: Confirmation | null;
  cancelLoading: boolean;
  confirmLoading: boolean;

  isShowing: boolean;

  setConfirmLoading: (confirmLoading: boolean) => void;
  setCancelLoading: (cancelLoading: boolean) => void;
  showConfirmation: (confirmation: Confirmation) => void;
  hideConfirmation: () => void;
};

const ConfirmationContext = React.createContext<IConfirmationContext>({
  confirmation: null,
  cancelLoading: false,
  confirmLoading: false,
  isShowing: false,
  setConfirmLoading: () => void null,
  setCancelLoading: () => void null,
  showConfirmation: () => void null,
  hideConfirmation: () => void null,
});

const ANIMATION_DURATION = 300;

export const ConfirmationProvider: React.FunctionComponent = ({ children }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const showConfirmation = useCallback((c: Confirmation) => {
    setConfirmation(c);
    setIsShowing(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsShowing(false);
    setTimeout(() => {
      setCancelLoading(false);
      setConfirmLoading(false);
      setConfirmation(null);
    }, ANIMATION_DURATION);
  }, []);

  const ctx: IConfirmationContext = {
    confirmation,
    confirmLoading,
    cancelLoading,
    isShowing,
    setConfirmLoading,
    setCancelLoading,
    showConfirmation,
    hideConfirmation,
  };

  return (
    <ConfirmationContext.Provider value={ctx}>
      {children}
    </ConfirmationContext.Provider>
  );
};

type ConfirmationResult =
  | ({
      hasConfirmed: true;
    } & Pick<IConfirmationContext, "hideConfirmation" | "setConfirmLoading">)
  | { hasConfirmed: false };

export const useConfirm = () => {
  const { showConfirmation, hideConfirmation, setConfirmLoading } = useContext(
    ConfirmationContext
  );

  return (
    confirmation: Omit<Confirmation, "onConfirm">
  ): Promise<ConfirmationResult> => {
    return new Promise((resolve) => {
      showConfirmation({
        ...confirmation,
        onConfirm: () => {
          resolve({ hideConfirmation, setConfirmLoading, hasConfirmed: true });
        },
        onCancel: () => {
          hideConfirmation();
          resolve({ hasConfirmed: false });
        },
      });
    });
  };
};

export function ConfirmationModal() {
  const {
    confirmation,
    cancelLoading,
    confirmLoading,
    hideConfirmation,
    isShowing,
  } = useContext(ConfirmationContext);

  return (
    <>
      <Modal open={isShowing} onClose={hideConfirmation} withOverlay>
        <>
          <Box mb={spacing._1}>
            {confirmation && confirmation.message
              ? confirmation.message
              : "Are you sure?"}
          </Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={
                  confirmation && confirmation.onCancel
                    ? confirmation.onCancel
                    : hideConfirmation
                }
                secondary
                fullWidth
                loading={cancelLoading}
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
                loading={confirmLoading}
              >
                {confirmation && confirmation.confirmButtonText
                  ? confirmation.confirmButtonText
                  : "Yes"}
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <DarkOverlay showing={!!confirmation && false} />
    </>
  );
}

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
