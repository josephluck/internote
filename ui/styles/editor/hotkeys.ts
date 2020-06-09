import { SlateNodeType, InternoteSlateEditor } from "./types";
import { useCallback, KeyboardEvent } from "react";
import isHotkey from "is-hotkey";
import { toggleMark } from "./utils";

export const HOT_KEYS: Record<string, SlateNodeType> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

export const useEditorShortcut = (editor: InternoteSlateEditor) => {
  const handleShortcut = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOT_KEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        const mark = HOT_KEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  }, []);
  return handleShortcut;
};
