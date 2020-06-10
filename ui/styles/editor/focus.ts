import { Editor, Node, NodeEntry } from "slate";
import { ReactEditor } from "slate-react";
import { isServer } from "../../utilities/window";
import { InternoteSlateEditor } from "./types";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

export const getCurrentFocusedLeaf = (
  editor: InternoteSlateEditor
): O.Option<Node> => {
  const { selection } = editor;
  if (!selection) {
    return O.none;
  }
  return pipe(
    O.fromNullable(Editor.node(editor, selection)),
    O.map(([node]) => node)
  );
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

export const getCurrentFocusedHTMLLeafTextContent = (
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getCurrentFocusedHTMLLeaf(editor),
    O.map((element) => element.textContent)
  );

export const getCurrentFocusedHTMLNode = (
  editor: InternoteSlateEditor
): O.Option<HTMLElement> =>
  pipe(
    getCurrentFocusedHTMLLeaf(editor),
    O.filterMap(findAncestor(SLATE_BLOCK_CLASS_NAME))
  );

export const getCurrentFocusedHTMLNodeTextContent = (
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getCurrentFocusedHTMLNode(editor),
    O.map((element) => element.textContent)
  );

/**
 * Recursively scans up an element tree until an element with the provided class
 * is found.
 */
const findAncestor = (className: string) => (
  elm: HTMLElement
): O.Option<HTMLElement> =>
  pipe(
    O.fromNullable(elm),
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
export const elmHasChildFocus = (elm: HTMLElement): boolean =>
  !isServer() && elm.contains(window.getSelection().focusNode);
