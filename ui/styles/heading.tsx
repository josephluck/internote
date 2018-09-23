import * as React from "react";
import { spacing, color } from "../styles/theme";
import { Logo } from "../styles/logo";
import { BlockLink } from "../styles/link";
import styled from "styled-components";
import { Store } from "../store";
import { Menu, Add } from "styled-icons/material";
import { Flex } from "grid-styled";

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

export function Heading({ store }: { store: Store }) {
  return (
    <HeadingWrapper>
      <BlockLink href="/">
        <Logo />
      </BlockLink>
      <Flex>
        <Add
          height="25"
          width="25"
          fill={color.jumbo}
          onClick={store.actions.newNote}
          style={{ cursor: "pointer", marginRight: spacing._0_25 }}
        />
        <Menu
          height="25"
          width="25"
          fill={color.jumbo}
          onClick={() => store.actions.setSidebarOpen(true)}
          style={{ cursor: "pointer" }}
        />
      </Flex>
    </HeadingWrapper>
  );
}
