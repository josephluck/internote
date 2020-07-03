import {
  faCompress,
  faExpand,
  faPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetNoteDTO } from "@internote/notes-service/types";
import { Flex } from "@rebass/grid";
import React, { useState } from "react";
import styled from "styled-components";

import { createNote } from "../store/notes/notes";
import { useLoadingAction, useStately } from "../store/store";
import { toggleFullscreen } from "../store/ui/ui";
import { BlockLink } from "../styles/link";
import { Logo } from "../styles/logo";
import { spacing } from "../theming/symbols";
import { ExpandingIconButton } from "./expanding-icon-button";
import { ExportMenu } from "./export-menu";
import { NoteMenu } from "./note-menu";
import { SettingsMenu } from "./settings-menu";
import { Wrapper } from "./wrapper";

const HeadingWrapper = styled.div<{
  distractionFree: boolean;
  forceShow: boolean;
}>`
  padding: ${spacing._0_5} 0;
  flex: 0 0 auto;
  background: ${(props) => props.theme.headingBackground};
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  transition: all 500ms ease;
  opacity: ${(props) => (props.distractionFree && !props.forceShow ? 0 : 1)};
  transform: ${(props) =>
    props.distractionFree && !props.forceShow
      ? "translateY(-5px)"
      : "translateY(0px)"};
  z-index: 5;
  &:hover {
    opacity: 1;
    transform: translateY(0px);
    transition: all 200ms ease;
  }
`;

const HeadingInner = styled(Wrapper)`
  display: flex;
  align-items: center;
`;

const ButtonSpacer = styled.div`
  display: inline-flex;
  margin-right: ${spacing._0_25};
`;

export function Heading({ note }: { note: GetNoteDTO | null }) {
  const distractionFree = useStately(
    (state) => state.preferences.distractionFree
  );
  const isFullscreen = useStately((state) => state.ui.isFullscreen);

  const handleCreateNote = useLoadingAction(createNote);

  const [noteMenuShowing, setNoteMenuShowing] = useState(false);
  const [settingsMenuShowing, setSettingsMenuShowing] = useState(false);
  const [exportMenuShowing, setExportMenuShowing] = useState(false);

  const forceShow =
    noteMenuShowing ||
    settingsMenuShowing ||
    handleCreateNote.loading ||
    exportMenuShowing;

  return (
    <HeadingWrapper
      distractionFree={distractionFree || false}
      forceShow={forceShow}
    >
      <HeadingInner>
        <BlockLink href="/">
          <Logo>Internote</Logo>
        </BlockLink>
        <Flex flex="1" alignItems="center" justifyContent="center">
          <NoteMenu onMenuToggled={setNoteMenuShowing} currentNote={note} />
        </Flex>
        <ButtonSpacer>
          <ExpandingIconButton
            forceShow={isFullscreen}
            text={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={() => toggleFullscreen(!isFullscreen)}
            icon={
              isFullscreen ? (
                <FontAwesomeIcon icon={faCompress} />
              ) : (
                <FontAwesomeIcon icon={faExpand} />
              )
            }
          />
        </ButtonSpacer>
        <ButtonSpacer>
          <ExportMenu
            noteId={note ? note.noteId : ""}
            onMenuToggled={setExportMenuShowing}
          />
        </ButtonSpacer>
        <ButtonSpacer>
          <ExpandingIconButton
            forceShow={handleCreateNote.loading}
            text="Create note"
            onClick={handleCreateNote.exec}
            icon={
              handleCreateNote.loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faPlus} />
              )
            }
          />
        </ButtonSpacer>
        <SettingsMenu onMenuToggled={setSettingsMenuShowing} />
      </HeadingInner>
    </HeadingWrapper>
  );
}
