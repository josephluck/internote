import { SlateNodeType, InternoteSlateEditor } from "./types";
import { useCallback, KeyboardEvent } from "react";
import isHotkey from "is-hotkey";
import { toggleMark, toggleBlock } from "./utils";
import { useNodeFocus } from "./focus";
import { Editor } from "slate";

export const HOT_KEYS: Record<string, SlateNodeType> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

/**
 * Toggles formatting based on hotkey combinations
 */
export const useFormattingHotkey = (editor: InternoteSlateEditor) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): boolean => {
      for (const hotkey in HOT_KEYS) {
        if (isHotkey(hotkey, event as any)) {
          event.preventDefault();
          const mark = HOT_KEYS[hotkey];
          toggleMark(editor, mark);
          return true;
        }
      }
      return false;
    },
    []
  );
  return handleKeyPress;
};

/**
 * Resets list items when focused on an empty list item and a reset shortcut
 * is pressed. See below for the reset shortcuts
 */
export const useResetListBlocks = (editor: InternoteSlateEditor) => {
  const { getCurrentFocusedLeafAndPath } = useNodeFocus(editor);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const isValidResetKey = ["enter", "shift+tab"].some((key) =>
        // @ts-ignore hotkey doesn't like keyboard events!? Maybe a mismatch with React types
        isHotkey(key, event)
      );

      if (!isValidResetKey) return;

      const [leaf, path] = getCurrentFocusedLeafAndPath();
      const isEmpty = leaf && leaf.text === "";

      if (!isEmpty) return;

      const [previousNode] = Editor.above(editor, { at: path });
      const listNodeType: SlateNodeType = "list-item";
      const previousWasListItem = previousNode.type === listNodeType;

      if (!previousWasListItem) return;

      event.preventDefault(); // NB: prevent the newline
      toggleBlock(editor, "list-item"); // NB: existing list-item ~> paragraph
    },
    [getCurrentFocusedLeafAndPath, editor]
  );

  return handleKeyPress;
};
