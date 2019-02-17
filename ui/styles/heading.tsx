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

const HeadingWrapper = styled.div<{
  distractionFree: boolean;
  forceShow: boolean;
}>`
  padding: ${spacing._0_5} 0;
  flex: 0 0 auto;
  background: ${props => props.theme.headingBackground};
  position: ${props => (props.distractionFree ? "fixed" : "static")};
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

interface Props {
  store: Store;
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
    return (
      <HeadingWrapper
        distractionFree={this.props.store.state.distractionFree}
        forceShow={this.state.noteMenuShowing || this.state.settingsMenuShowing}
      >
        <HeadingInner>
          <BlockLink href="/">
            <Logo>Internote</Logo>
          </BlockLink>
          <Flex flex="1" alignItems="center" justifyContent="center">
            <NoteMenu
              store={this.props.store}
              onMenuToggled={this.setNoteMenuShowing}
            />
          </Flex>
          <SettingsMenu
            store={this.props.store}
            onMenuToggled={this.setSettingsMenuShowing}
          />
        </HeadingInner>
      </HeadingWrapper>
    );
  }
}
