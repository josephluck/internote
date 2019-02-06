import * as React from "react";
import { spacing, color } from "../styles/theme";
import { Logo } from "../styles/logo";
import { BlockLink } from "../styles/link";
import { Store } from "../store";
import { Wrapper } from "./wrapper";
import styled from "styled-components";
import { NoteMenu } from "./note-menu";
import { Flex } from "@rebass/grid";
import { SettingsMenu } from "./settings-menu";

const HeadingWrapper = styled.div`
  padding: ${spacing._0_5} 0;
  position: sticky;
  top: 0;
  z-index: 5;
  background: ${color.cinder};
`;

const HeadingInner = styled(Wrapper)`
  display: flex;
  align-items: center;
`;

export function Heading({ store }: { store: Store }) {
  return (
    <HeadingWrapper>
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
