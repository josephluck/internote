import React from "react";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import { spacing } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap
} from "./toolbar-expanding-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export function OutlineButton({
  isActive,
  onClick
}: {
  isActive: boolean;
  onClick: () => any;
}) {
  return (
    <CollapseWidthOnHover
      onClick={onClick}
      collapsedContent={<Flex pl={spacing._0_25}>Outline</Flex>}
    >
      {collapse => (
        <ToolbarExpandingButton isActive={isActive}>
          <ToolbarExpandingButtonIconWrap>
            <FontAwesomeIcon icon={faEye} />
          </ToolbarExpandingButtonIconWrap>
          {collapse.renderCollapsedContent()}
        </ToolbarExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
}
