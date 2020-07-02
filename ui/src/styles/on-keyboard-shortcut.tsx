import isKeyHotkey from "is-hotkey";
import React from "react";

export function OnKeyboardShortcut({
  keyCombo,
  cb,
}: {
  keyCombo: string;
  cb: () => void;
}) {
  React.useEffect(() => {
    function onKeyDown(event: Event) {
      const isHotkey = isKeyHotkey(keyCombo);
      // @ts-ignore
      if (isHotkey(event)) {
        event.preventDefault();
        cb();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return function () {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [keyCombo]);
  return null;
}
