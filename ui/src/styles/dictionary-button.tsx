import React, { useCallback } from "react";

import { useTwineActions } from "../store";
import {
  toolbarIconMap,
  toolbarLabelMap,
  toolbarShortcutMap,
} from "./editor/types";
import { Shortcut } from "./shortcuts";
import { ToolbarButton } from "./toolbar-button";

export const DictionaryButton: React.FunctionComponent<{
  isLoading: boolean;
  isShowing?: boolean;
  selectedWord: string;
}> = ({ isLoading, isShowing, selectedWord }) => {
  const close = useTwineActions((actions) => () =>
    actions.dictionary.setdictionaryShowing(false)
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
    <>
      {isShowing && (
        <Shortcut
          keyCombo="esc"
          callback={close}
          id="close-dictionary"
          description="Close the dictionary"
        />
      )}
      <ToolbarButton
        onClick={handlePress}
        forceExpand={isShowing}
        icon={toolbarIconMap[isLoading ? "dictionary-loading" : "dictionary"]}
        label={toolbarLabelMap.dictionary}
        name={toolbarLabelMap.dictionary}
        shortcut={toolbarShortcutMap.dictionary}
      />
    </>
  );
};
