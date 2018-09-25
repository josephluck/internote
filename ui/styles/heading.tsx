import * as React from "react";
import { spacing, color } from "../styles/theme";
import { Logo } from "../styles/logo";
import { BlockLink } from "../styles/link";
import { Store } from "../store";
import { Menu } from "styled-icons/material";
import { Flex } from "grid-styled";
import { Wrapper } from "./wrapper";
import styled from "styled-components";

const HeadingWrapper = styled.div`
  padding-top: ${spacing._0_5};
  padding-bottom: ${spacing._0_5};
  position: sticky;
  top: 0;
  background: ${color.cinder};
  border-bottom: solid 1px black;
`;

const HeadingInner = Wrapper.extend`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export function Heading({ store }: { store: Store }) {
  return (
    <HeadingWrapper>
      <HeadingInner>
        <BlockLink href="/">
          <Logo />
        </BlockLink>
        <Flex>
          <Menu
            height="25"
            width="25"
            fill={color.jumbo}
            onClick={() => store.actions.setSidebarOpen(true)}
            style={{ cursor: "pointer" }}
          />
        </Flex>
      </HeadingInner>
    </HeadingWrapper>
  );
}
