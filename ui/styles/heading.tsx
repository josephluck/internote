import * as React from "react";
import { spacing } from "../theming/symbols";
import { Logo } from "../styles/logo";
import { BlockLink } from "../styles/link";
import { useTwineState, useTwineActions } from "../store";
import { Wrapper } from "./wrapper";
import styled from "styled-components";
import { NoteMenu } from "./note-menu";
import { Flex } from "@rebass/grid";
import { SettingsMenu } from "./settings-menu";
import {
  faPlus,
  faSpinner,
  faCompress,
  faExpand
} from "@fortawesome/free-solid-svg-icons";
import { ExpandingIconButton } from "./expanding-icon-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetNoteDTO } from "@internote/notes-service/types";
import { ExportMenu } from "./export-menu";

const HeadingWrapper = styled.div<{
  distractionFree: boolean;
  forceShow: boolean;
}>`
  padding: ${spacing._0_5} 0;
  flex: 0 0 auto;
  background: ${props => props.theme.headingBackground};
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  transition: all 500ms ease;
  opacity: ${props => (props.distractionFree && !props.forceShow ? 0 : 1)};
  transform: ${props =>
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
  margin-right: ${spacing._0_25};
`;

export function Heading({ note }: { note: GetNoteDTO | null }) {
  const createNoteLoading = useTwineState(
    state => state.notes.loading.createNote
  );
  const distractionFree = useTwineState(
    state => state.preferences.distractionFree
  );
  const isFullscreen = useTwineState(state => state.ui.isFullscreen);

  const { toggleFullscreen, createNote } = useTwineActions(actions => ({
    toggleFullscreen: actions.ui.toggleFullscreen,
    createNote: actions.notes.createNote
  }));

  const [noteMenuShowing, setNoteMenuShowing] = React.useState(false);
  const [settingsMenuShowing, setSettingsMenuShowing] = React.useState(false);
  const [exportMenuShowing, setExportMenuShowing] = React.useState(false);

  const forceShow =
    noteMenuShowing ||
    settingsMenuShowing ||
    createNoteLoading ||
    exportMenuShowing;

  return (
    <HeadingWrapper distractionFree={distractionFree} forceShow={forceShow}>
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
            noteId={note.noteId}
            onMenuToggled={setExportMenuShowing}
          />
        </ButtonSpacer>
        <ButtonSpacer>
          <ExpandingIconButton
            forceShow={createNoteLoading}
            text="Create note"
            onClick={createNote}
            icon={
              createNoteLoading ? (
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
