import { faBook, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@rebass/grid";
import React, { useCallback } from "react";
import { useTwineActions } from "../store";
import { spacing } from "../theming/symbols";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap,
} from "./toolbar-expanding-button";

export const DictionaryButton: React.FunctionComponent<{
  isLoading: boolean;
  isShowing: boolean;
}> = ({ isLoading, isShowing }) => {
  const close = useTwineActions((actions) => () =>
    actions.dictionary.setDictionaryShowing(false)
  );

  const lookup = useTwineActions((actions) => actions.dictionary.lookup);

  const handlePress = useCallback(() => {
    if (isShowing) {
      close();
    } else {
      lookup("Architecture");
    }
  }, [close, isShowing, lookup]);

  return (
    <CollapseWidthOnHover
      onClick={handlePress}
      forceShow={isShowing}
      collapsedContent={<Flex pl={spacing._0_25}>Dictionary</Flex>}
    >
      {(collapse) => (
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
};
