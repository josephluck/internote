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

const HeadingWrapper = styled.div<{ distractionFree: boolean }>`
  padding: ${spacing._0_5} 0;
  flex: 0 0 auto;
  background: ${props => props.theme.headingBackground};
  position: ${props => (props.distractionFree ? "fixed" : "static")};
  left: 0;
  right: 0;
  top: 0;
  transition: all 300ms ease;
  opacity: ${props => (props.distractionFree ? 0 : 1)};
  transform: ${props =>
    props.distractionFree ? "translateY(-5px)" : "translateY(0px)"};
  z-index: 5;
  &:hover {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const HeadingInner = styled(Wrapper)`
  display: flex;
  align-items: center;
`;

export function Heading({ store }: { store: Store }) {
  return (
    <HeadingWrapper distractionFree={store.state.distractionFree}>
      <HeadingInner>
        <BlockLink href="/">
          <Logo>Internote</Logo>
        </BlockLink>
        <Flex flex="1" alignItems="center" justifyContent="center">
          <NoteMenu store={store} />
        </Flex>
        <SettingsMenu store={store} />
      </HeadingInner>
    </HeadingWrapper>
  );
}
