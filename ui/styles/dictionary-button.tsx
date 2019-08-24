import React from "react";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import { spacing } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap
} from "./toolbar-expanding-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faBook } from "@fortawesome/free-solid-svg-icons";
import { useTwineState } from "../store";

export function DictionaryButton({
  onClick,
  isShowing
}: {
  onClick: () => any;
  isShowing: boolean;
}) {
  const isLoading = useTwineState(state => state.dictionary.loading.lookup);
  return (
    <CollapseWidthOnHover
      onClick={onClick}
      forceShow={isShowing}
      collapsedContent={<Flex pl={spacing._0_25}>Dictionary</Flex>}
    >
      {collapse => (
        <ToolbarExpandingButton forceShow={isShowing}>
          <ToolbarExpandingButtonIconWrap>
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faBook} />
            )}
          </ToolbarExpandingButtonIconWrap>
          {collapse.renderCollapsedContent()}
        </ToolbarExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
}
