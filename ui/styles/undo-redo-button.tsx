import React from "react";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import { spacing } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap,
} from "./toolbar-expanding-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export function UndoRedoButton({
  icon,
  onClick,
  tooltip,
}: {
  icon: IconProp;
  onClick: () => any;
  tooltip: string;
}) {
  return (
    <CollapseWidthOnHover
      onClick={onClick}
      collapsedContent={<Flex pl={spacing._0_25}>{tooltip}</Flex>}
    >
      {(collapse) => (
        <ToolbarExpandingButton>
          <ToolbarExpandingButtonIconWrap>
            <FontAwesomeIcon icon={icon} />
          </ToolbarExpandingButtonIconWrap>
          {collapse.renderCollapsedContent()}
        </ToolbarExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
}
