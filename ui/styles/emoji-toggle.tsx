import React from "react";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import { spacing } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap
} from "./toolbar-expanding-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmileBeam } from "@fortawesome/free-solid-svg-icons";

export function EmojiToggle({
  isActive,
  onClick
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
      {collapse => (
        <ToolbarExpandingButton forceShow={isActive}>
          <ToolbarExpandingButtonIconWrap>
            <FontAwesomeIcon icon={faSmileBeam} />
          </ToolbarExpandingButtonIconWrap>
          {collapse.renderCollapsedContent()}
        </ToolbarExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
}
