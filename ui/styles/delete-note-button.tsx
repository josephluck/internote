import React from "react";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import { spacing } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap
} from "./toolbar-expanding-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function DeleteNoteButton({ onClick }: { onClick: () => any }) {
  return (
    <CollapseWidthOnHover
      onClick={onClick}
      collapsedContent={<Flex pl={spacing._0_25}>Delete</Flex>}
    >
      {collapse => (
        <ToolbarExpandingButton>
          <ToolbarExpandingButtonIconWrap>
            <FontAwesomeIcon icon={faTrash} />
          </ToolbarExpandingButtonIconWrap>
          {collapse.renderCollapsedContent()}
        </ToolbarExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
}
