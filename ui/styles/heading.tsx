import * as React from "react";
import { spacing } from "../theming/symbols";
import { Logo } from "../styles/logo";
import { BlockLink } from "../styles/link";
import { useTwine } from "../store";
import { Wrapper } from "./wrapper";
import { styled } from "../theming/styled";
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
import * as Types from "@internote/api/domains/types";

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

export function Heading({ note }: { note: Types.Note | null }) {
  const [noteMenuShowing, setNoteMenuShowing] = React.useState(false);
  const [settingsMenuShowing, setSettingsMenuShowing] = React.useState(false);

  const [
    { createNoteLoading, distractionFree, isFullscreen },
    { toggleFullscreen, createNote }
  ] = useTwine(
    state => ({
      createNoteLoading: state.notes.loading.createNote,
      distractionFree: state.preferences.distractionFree,
      isFullscreen: state.ui.isFullscreen
    }),
    actions => ({
      toggleFullscreen: actions.ui.toggleFullscreen,
      createNote: actions.notes.createNote
    })
  );

  const forceShow = noteMenuShowing || settingsMenuShowing || createNoteLoading;

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
