import React from "react";
import isKeyHotkey from "is-hotkey";

export function OnKeyboardShortcut({
  keyCombo,
  cb
}: {
  keyCombo: string;
  cb: () => void;
}) {
  React.useEffect(() => {
    function onKeyDown(event: Event) {
      const isHotkey = isKeyHotkey(keyCombo);
      if (isHotkey(event)) {
        event.preventDefault();
        cb();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return function() {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [keyCombo]);
  return null;
}
