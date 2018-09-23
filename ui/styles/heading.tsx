import * as React from "react";
import { spacing, color } from "../styles/theme";
import { Logo } from "../styles/logo";
import { BlockLink, TextLink } from "../styles/link";
import styled from "styled-components";
import styledTs from "styled-components-ts";
import { Store } from "../store";
import { Menu, Clear } from "styled-icons/material";

const HeadingWrapper = styled.div`
  padding: ${spacing._0_5} ${spacing._2};
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
  z-index: 10;
  right: 0;
  top: 0;
  height: 100%;
  max-width: 300px;
  min-width: 100px;
  width: 80%;
  background: black;
  transition: all 333ms ease;
  transform: translateX(${props => (props.open ? "0%" : "100%")});
  opacity: ${props => (props.open ? "1" : "0")};
`;

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

const SidebarItem = styled.div`
  padding: ${spacing._0_5} ${spacing._1};
  overflow: hidden;
  display: flex;
`;

const SidebarCloseItem = SidebarItem.extend`
  justify-content: flex-end;
  padding-right: ${spacing._2};
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
          <BlockLink href="/">
            <Logo />
          </BlockLink>
          <Menu
            height="25"
            width="25"
            fill={color.jumbo}
            onClick={this.setSidebarOpen(true)}
          />
        </HeadingWrapper>
        <Sidebar open={this.state.sidebarOpen}>
          <SidebarCloseItem>
            <Clear
              height="25"
              width="25"
              fill={color.jumbo}
              onClick={this.setSidebarOpen(false)}
            />
          </SidebarCloseItem>
          {this.props.store.state.notes.map(note => (
            <SidebarItem onClick={this.setSidebarOpen(false)}>
              <EllipsisText>
                <TextLink href={`/?id=${note.id}`}>{note.content}</TextLink>
              </EllipsisText>
            </SidebarItem>
          ))}
        </Sidebar>
        <DarkOverlay showing={this.state.sidebarOpen} />
      </>
    );
  }
}
