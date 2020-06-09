import React from "react";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import { spacing, font } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap,
} from "./toolbar-expanding-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const IconWrap = styled(ToolbarExpandingButtonIconWrap)`
  font-size: ${font._12.lineHeight};
`;

export function EmojiToggle({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => any;
}) {
  return (
    <CollapseWidthOnHover
      onClick={onClick}
      forceShow={isActive}
      collapsedContent={<Flex pl={spacing._0_25}>Emojis</Flex>}
    >
      {(collapse) => (
        <ToolbarExpandingButton forceShow={isActive}>
          <IconWrap>
            <FontAwesomeIcon icon={faGrinAlt} />
          </IconWrap>
          {collapse.renderCollapsedContent()}
        </ToolbarExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
}
