import React from "react";
import { StoriesOf } from "../types";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import styled from "styled-components";

const Collapse = styled(CollapseWidthOnHover)`
  background-color: ${props => props.theme.toolbarButtonActiveBackground};
  display: inline-block;
  white-space: nowrap;
`;

export default function(s: StoriesOf) {
  s("CollapseWidthOnHover", module)
    .add("default", () => {
      return (
        <Collapse collapsedContent={<Flex>Collapsed content</Flex>}>
          {collapse => (
            <Flex>Outer content {collapse.renderCollapsedContent()}</Flex>
          )}
        </Collapse>
      );
    })
    .add("Force shown", () => {
      return (
        <Collapse forceShow collapsedContent={<Flex>Collapsed content</Flex>}>
          {collapse => (
            <Flex>Outer content {collapse.renderCollapsedContent()}</Flex>
          )}
        </Collapse>
      );
    });
}
