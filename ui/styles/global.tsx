import * as React from "react";
import { color, spacing } from "../styles/theme";
import styled from "styled-components";
import styledTs from "styled-components-ts";
import { Store } from "../store";
import { Sidebar } from "./sidebar";
import { Modal } from "./modal";
import { Button } from "./button";
import { Flex, Box } from "grid-styled";

const DarkOverlay = styledTs<{ showing: boolean }>(styled.div)`
  position: fixed;
  z-index: 9;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: ${color.cinder};
  transition: all 333ms ease;
  opacity: ${props => (props.showing ? "0.9" : "0")};
  pointer-events: none;
`;

export function Global({ store }: { store: Store }) {
  return (
    <>
      <Sidebar
        open={store.state.sidebarOpen}
        onClose={() => store.actions.setSidebarOpen(false)}
      >
        <Box p={spacing._1} flex={0}>
          <Flex mb={spacing._0_5}>
            <Button
              fullWidth
              onClick={() => {
                store.actions.setSidebarOpen(false);
                store.actions.setSignOutModalOpen(true);
              }}
            >
              Sign out
            </Button>
          </Flex>
          <Flex>
            <Button
              fullWidth
              onClick={() => {
                store.actions.setSidebarOpen(false);
                store.actions.setDeleteAccountModalOpen(true);
              }}
            >
              Delete account
            </Button>
          </Flex>
        </Box>
      </Sidebar>
      <Modal
        open={store.state.deleteNoteModalOpen}
        onClose={() => store.actions.setDeleteNoteModalOpen(false)}
        showCloseIcon={false}
      >
        <>
          <Box mb={spacing._1}>Are you sure you wish to delete this note?</Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={() => store.actions.setDeleteNoteModalOpen(false)}
                secondary
                fullWidth
              >
                No
              </Button>
            </Box>
            <Box flex={1} ml={spacing._0_25}>
              <Button onClick={store.actions.deleteNote} secondary fullWidth>
                Yes
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <Modal
        open={store.state.signOutModalOpen}
        onClose={() => store.actions.setSignOutModalOpen(false)}
        showCloseIcon={false}
      >
        <>
          <Box mb={spacing._1}>Are you sure you wish to sign out?</Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={() => store.actions.setSignOutModalOpen(false)}
                secondary
                fullWidth
              >
                No
              </Button>
            </Box>
            <Box flex={1} ml={spacing._0_25}>
              <Button onClick={store.actions.signOut} secondary fullWidth>
                Yes
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <Modal
        open={store.state.deleteAccountModalOpen}
        onClose={() => store.actions.setDeleteAccountModalOpen(false)}
        showCloseIcon={false}
      >
        <>
          <Box mb={spacing._1}>
            Are you sure you wish to delete your account?
          </Box>
          <Flex>
            <Box flex={1} mr={spacing._0_25}>
              <Button
                onClick={() => store.actions.setDeleteAccountModalOpen(false)}
                secondary
                fullWidth
              >
                No
              </Button>
            </Box>
            <Box flex={1} ml={spacing._0_25}>
              <Button onClick={store.actions.deleteAccount} secondary fullWidth>
                Yes
              </Button>
            </Box>
          </Flex>
        </>
      </Modal>
      <DarkOverlay
        showing={
          store.state.sidebarOpen ||
          store.state.deleteNoteModalOpen ||
          store.state.signOutModalOpen ||
          store.state.deleteAccountModalOpen
        }
      />
    </>
  );
}
