import { Flex } from "@rebass/grid";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { StoriesOf } from "../types";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";

const Collapse = styled(CollapseWidthOnHover)`
  background-color: ${(props) => props.theme.toolbarButtonActiveBackground};
  display: inline-block;
  white-space: nowrap;
`;

export default function (s: StoriesOf) {
  s("CollapseWidthOnHover", module)
    .add("default", () => {
      return (
        <Collapse collapsedContent={<Flex>Collapsed content</Flex>}>
          {(collapse) => (
            <Flex>Outer content {collapse.renderCollapsedContent()}</Flex>
          )}
        </Collapse>
      );
    })
    .add("Force shown", () => {
      return (
        <Collapse forceShow collapsedContent={<Flex>Collapsed content</Flex>}>
          {(collapse) => (
            <Flex>Outer content {collapse.renderCollapsedContent()}</Flex>
          )}
        </Collapse>
      );
    })
    .add("With changing inner content width", () => (
      <ChangingInnerContentWidth />
    ));
}

function ChangingInnerContentWidth() {
  const [bool, setBool] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBool(!bool);
    }, 2000);
  }, [bool]);

  return (
    <Collapse
      collapsedContent={<Flex>{bool ? "Small" : "Laaaaaaaaaarge"}</Flex>}
      forceShow
    >
      {(collapse) => (
        <Flex>Outer content {collapse.renderCollapsedContent()}</Flex>
      )}
    </Collapse>
  );
}
