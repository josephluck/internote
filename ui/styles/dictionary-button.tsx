import React, { useCallback } from "react";
import { useTwineActions } from "../store";
import { ToolbarButton, toolbarIconMap } from "./toolbar-button";

export const DictionaryButton: React.FunctionComponent<{
  isLoading: boolean;
  isShowing: boolean;
  selectedWord: string;
}> = ({ isLoading, isShowing, selectedWord }) => {
  const close = useTwineActions((actions) => () =>
    actions.dictionary.setDictionaryShowing(false)
  );

  const lookup = useTwineActions((actions) => actions.dictionary.lookup);

  // TODO: could extract a custom press handler that doesn't lose focus on editor
  // if this becomes a common pattern
  const handlePress = useCallback(() => {
    if (isShowing) {
      close();
    } else {
      lookup(selectedWord);
    }
  }, [close, isShowing, lookup, selectedWord]);

  return (
    <ToolbarButton
      onClick={handlePress}
      forceExpand={isShowing}
      label="Dictionary"
      icon={toolbarIconMap[isLoading ? "dictionary-loading" : "dictionary"]}
    />
  );
};
