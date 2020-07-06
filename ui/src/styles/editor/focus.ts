import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Editor, Node, NodeEntry } from "slate";
import { ReactEditor } from "slate-react";

import { InternoteSlateEditor } from "./types";

export const getCurrentFocusedLeaf = (
  editor: InternoteSlateEditor
): O.Option<Node> => {
  const { selection } = editor;
  return selection
    ? pipe(
        O.fromNullable(Editor.node(editor, selection)),
        O.map(([node]) => node)
      )
    : O.none;
};

export const getCurrentFocusedLeafAndPath = (
  editor: InternoteSlateEditor
): O.Option<NodeEntry<Node>> => {
  const { selection } = editor;
  if (!selection) {
    return O.none;
  }
  return O.fromNullable(Editor.node(editor, selection));
};

export const getCurrentFocusedHTMLLeaf = (
  editor: InternoteSlateEditor
): O.Option<HTMLElement> =>
  pipe(
    getCurrentFocusedLeaf(editor),
    O.filter((node) => node.text !== ""),
    O.filterMap((node) => O.tryCatch(() => ReactEditor.toDOMNode(editor, node)))
  );

export const getCurrentFocusedHTMLNode = (
  editor: InternoteSlateEditor
): O.Option<HTMLElement> =>
  pipe(
    getCurrentFocusedHTMLLeaf(editor),
    O.filterMap(findAncestor(SLATE_BLOCK_CLASS_NAME))
  );

/**
 * Recursively scans up an element tree until an element with the provided class
 * is found.
 */
export const findAncestor = (className: string) => (
  elm: HTMLElement
): O.Option<HTMLElement> =>
  pipe(
    O.fromNullable(elm),
    O.filter((element) => !!element.classList),
    O.filter((element) => element.classList.contains(className)),
    O.fold(
      () =>
        pipe(
          O.fromNullable(elm),
          O.mapNullable((element) => element.parentElement),
          O.filterMap(findAncestor(className))
        ),
      O.some
    )
  );

export const SLATE_BLOCK_CLASS_NAME = "slate-block";

export const SLATE_BLOCK_FOCUSED_CLASS_NAME = "slate-block-focused";

/**
 * Given a HTML element, return whether the current focus is somewhere inside
 * it.
 */
export const elmHasChildFocus = (elm: HTMLElement): boolean => {
  const selection = window.getSelection();
  return !!selection && elm.contains(selection.focusNode);
};
