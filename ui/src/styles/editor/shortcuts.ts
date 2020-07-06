import { InternoteEditorNodeType } from "@internote/lib/editor-types";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Editor, Point, Range, Transforms } from "slate";

import { getWordTextUnderCursor } from "./selection";
import { InternoteSlateEditor } from "./types";

/**
 * Gets and returns the text under a "smart" search.
 * For example `:smile` where `:` is the shortcut and `smile` is the search.
 * For example `#hashtag` where `#` is the shortcut and `hashtag` is the search.
 */
export const getSmartSearchShortcut = (shortcut: string) => (
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getWordTextUnderCursor(editor, true),
    O.filter((text) => text.startsWith(shortcut)),
    O.filterMap(trimFirstCharacterFromString)
  );

export const getEmojiSearchShortcut = getSmartSearchShortcut(":");

export const getHashtagSearchShortcut = getSmartSearchShortcut("#");

const trimFirstCharacterFromString = (value: string): O.Option<string> =>
  pipe(
    O.some(value),
    O.filter((str) => str.length > 1),
    O.filterMap((str) => O.fromNullable(str.substring(1)))
  );

const defaultShortcuts: Record<string, InternoteEditorNodeType> = {
  "*": "list-item",
  "-": "list-item",
  "+": "list-item",
  ">": "block-quote",
  "#": "heading-one",
  "##": "heading-two",
};

export const withShortcuts = <T extends Editor>(
  editor: T,
  shortcuts = defaultShortcuts
): T => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === " " && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type = shortcuts[beforeText];

      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        Transforms.setNodes(
          editor,
          { type },
          { match: (n) => Editor.isBlock(editor, n) }
        );

        if (type === "list-item") {
          const list = { type: "bulleted-list", children: [] };
          Transforms.wrapNodes(editor, list, {
            match: (n) => n.type === "list-item",
          });
        }

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          block.type !== "paragraph" &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: "paragraph" });

          if (block.type === "list-item") {
            Transforms.unwrapNodes(editor, {
              match: (n) => n.type === "bulleted-list",
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};
