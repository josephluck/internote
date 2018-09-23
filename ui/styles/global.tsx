import * as React from "react";
import { color, spacing } from "../styles/theme";
import { TextLink } from "../styles/link";
import styled from "styled-components";
import styledTs from "styled-components-ts";
import { Store } from "../store";
import { Sidebar, SidebarItem } from "./sidebar";
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

const EllipsisText = styled.span`
  display: inline-flex;
  width: 100%;
  overflow: hidden;
  a {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export function Global({ store }: { store: Store }) {
  return (
    <>
      <Sidebar
        open={store.state.sidebarOpen}
        onClose={() => store.actions.setSidebarOpen(false)}
      >
        <>
          {store.state.notes.map(note => (
            <SidebarItem onClick={() => store.actions.setSidebarOpen(false)}>
              <EllipsisText>
                <TextLink href={`/?id=${note.id}`}>{note.content}</TextLink>
              </EllipsisText>
            </SidebarItem>
          ))}
        </>
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
      <DarkOverlay
        showing={store.state.sidebarOpen || store.state.deleteNoteModalOpen}
      />
    </>
  );
}
