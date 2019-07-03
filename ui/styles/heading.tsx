import * as React from "react";
import { spacing } from "../theming/symbols";
import { Logo } from "../styles/logo";
import { BlockLink } from "../styles/link";
import { Store } from "../store";
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

interface Props {
  store: Store;
  note: Types.Note | null;
}
interface State {
  noteMenuShowing: boolean;
  settingsMenuShowing: boolean;
}

export class Heading extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { noteMenuShowing: false, settingsMenuShowing: false };
  }

  setNoteMenuShowing = (noteMenuShowing: boolean) => {
    this.setState({ noteMenuShowing });
  };

  setSettingsMenuShowing = (settingsMenuShowing: boolean) => {
    this.setState({ settingsMenuShowing });
  };

  render() {
    const forceShow =
      this.state.noteMenuShowing ||
      this.state.settingsMenuShowing ||
      this.props.store.state.notes.loading.createNote;

    return (
      <HeadingWrapper
        distractionFree={this.props.store.state.preferences.distractionFree}
        forceShow={forceShow}
      >
        <HeadingInner>
          <BlockLink href="/">
            <Logo>Internote</Logo>
          </BlockLink>
          <Flex flex="1" alignItems="center" justifyContent="center">
            <NoteMenu
              onMenuToggled={this.setNoteMenuShowing}
              currentNote={this.props.note}
            />
          </Flex>
          <ButtonSpacer>
            <ExpandingIconButton
              forceShow={this.props.store.state.ui.isFullscreen}
              text={
                this.props.store.state.ui.isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
              onClick={() =>
                this.props.store.actions.ui.toggleFullscreen(
                  !this.props.store.state.ui.isFullscreen
                )
              }
              icon={
                this.props.store.state.ui.isFullscreen ? (
                  <FontAwesomeIcon icon={faCompress} />
                ) : (
                  <FontAwesomeIcon icon={faExpand} />
                )
              }
            />
          </ButtonSpacer>
          <ButtonSpacer>
            <ExpandingIconButton
              forceShow={this.props.store.state.notes.loading.createNote}
              text="Create note"
              onClick={this.props.store.actions.notes.createNote}
              icon={
                this.props.store.state.notes.loading.createNote ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faPlus} />
                )
              }
            />
          </ButtonSpacer>
          <SettingsMenu onMenuToggled={this.setSettingsMenuShowing} />
        </HeadingInner>
      </HeadingWrapper>
    );
  }
}
