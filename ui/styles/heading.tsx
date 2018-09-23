import * as React from "react";
import { spacing, color } from "../styles/theme";
import { Logo } from "../styles/logo";
import { BlockLink, TextLink } from "../styles/link";
import styled from "styled-components";
import styledTs from "styled-components-ts";
import { Store } from "../store";
import { Menu } from "styled-icons/feather";
import { X } from "styled-icons/feather";

const HeadingWrapper = styled.div`
  padding: ${spacing._0_5} ${spacing._1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: ${color.cinder};
  border-bottom: solid 1px black;
`;

const Sidebar = styledTs<{ open: boolean }>(styled.div)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  max-width: 300px;
  min-width: 100px;
  width: 80%;
  background: black;
  transition: all 333ms ease;
  transform: translateX(${props => (props.open ? "0%" : "-100%")});
  opacity: ${props => (props.open ? "1" : "0")};
`;

const SidebarItem = styled.div`
  margin: ${spacing._0_5} ${spacing._1};
  overflow: hidden;
  display: flex;
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

interface Props {
  store: Store;
}

interface State {
  sidebarOpen: boolean;
}

export default class Heading extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sidebarOpen: false
    };
  }

  setSidebarOpen = (sidebarOpen: boolean) => () => {
    this.setState({
      sidebarOpen
    });
  };

  render() {
    return (
      <>
        <HeadingWrapper>
          <Menu height="25" width="25" onClick={this.setSidebarOpen(true)} />
          <BlockLink href="/">
            <Logo />
          </BlockLink>
          <div />
        </HeadingWrapper>
        <Sidebar open={this.state.sidebarOpen}>
          <SidebarItem>
            <X height="25" width="25" onClick={this.setSidebarOpen(false)} />
          </SidebarItem>
          {this.props.store.state.notes.map(note => (
            <SidebarItem onClick={this.setSidebarOpen(false)}>
              <EllipsisText>
                <TextLink href={`/?id=${note.id}`}>{note.id}</TextLink>
              </EllipsisText>
            </SidebarItem>
          ))}
        </Sidebar>
      </>
    );
  }
}
