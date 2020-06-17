import { InternoteEditorNodeType, InternoteSlateEditor } from "./types";
import { useCallback, KeyboardEvent } from "react";
import isHotkey from "is-hotkey";
import { toggleBlock } from "./utils";
import { getCurrentFocusedLeafAndPath } from "./focus";
import { Editor } from "slate";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

/**
 * Resets list items when focused on an empty list item and a reset shortcut
 * is pressed. See below for the reset shortcuts
 */
export const useResetListBlocks = (editor: InternoteSlateEditor) =>
  useCallback(
    (event: KeyboardEvent) => {
      const isValidResetKey = ["enter", "shift+tab"].some((key) =>
        // @ts-ignore hotkey doesn't like keyboard events!? Maybe a mismatch with React types
        isHotkey(key, event)
      );

      if (!isValidResetKey) return;

      const leafAndPath = getCurrentFocusedLeafAndPath(editor);
      const isEmpty = pipe(
        leafAndPath,
        O.filter(([leaf]) => leaf.text === ""),
        O.isSome
      );

      if (!isEmpty) return;

      const listNodeType: InternoteEditorNodeType = "list-item";
      const previousWasListItem = pipe(
        leafAndPath,
        O.filterMap(([_node, path]) =>
          O.fromNullable(Editor.above(editor, { at: path }))
        ),
        O.filter(([previousNode]) => previousNode.type === listNodeType),
        O.isSome
      );

      if (!previousWasListItem) return;

      event.preventDefault(); // NB: prevent the newline
      toggleBlock(editor, "list-item"); // NB: existing list-item ~> paragraph
    },
    [editor]
  );

export const isNavigationShortcut = (event: React.KeyboardEvent): boolean =>
  // @ts-ignore isHotkey types incompatible with react's
  ["right", "left", "enter"].some((key) => isHotkey(key, event));

/**
 * Calls event handlers in sequence stopping at the first event handler that
 * prevents default.
 */
export const sequenceKeyboardEventHandlers = (
  ...fns: ((event: React.KeyboardEvent) => void)[]
) => (event: React.KeyboardEvent) =>
  fns.reduce((prevented, fn) => {
    if (!prevented) {
      fn(event);
    }
    return event.isDefaultPrevented();
  }, false);
