import { useRef, useCallback } from "react";
import { ReactEditor } from "slate-react";
import { InternoteSlateEditor } from "./types";
import { Editor } from "slate";
import { isServer } from "../../utilities/window";

/**
 * Provides useful utilities for dealing with node focus
 */
export const useNodeFocus = (editor: InternoteSlateEditor) => {
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const getCurrentFocusedLeaf = useCallback(() => {
    const { selection } = editorRef.current;
    if (selection) {
      const [node] = Editor.node(editorRef.current, selection);
      return node;
    }
  }, []);

  const getCurrentFocusedLeafAndPath = useCallback(() => {
    const { selection } = editorRef.current;
    if (selection) {
      return Editor.node(editorRef.current, selection);
    }
  }, []);

  const getCurrentFocusedHTMLLeaf = useCallback(
    () => ReactEditor.toDOMNode(editorRef.current, getCurrentFocusedLeaf()),
    [getCurrentFocusedLeaf]
  );

  const getCurrentFocusedHTMLNode = useCallback(
    () => findAncestor(getCurrentFocusedHTMLLeaf(), SLATE_BLOCK_CLASS_NAME),
    [getCurrentFocusedHTMLLeaf]
  );

  return {
    getCurrentFocusedLeaf,
    getCurrentFocusedLeafAndPath,
    getCurrentFocusedHTMLLeaf,
    getCurrentFocusedHTMLNode,
  };
};

/**
 * Recursively scans up an element tree until an element with the provided class
 * is found.
 * TODO: this should return an Option<HTMLElement>
 */
const findAncestor = (elm: HTMLElement, className: string): HTMLElement =>
  elm.classList.contains(className)
    ? elm
    : findAncestor(elm.parentNode as HTMLElement, className);

export const SLATE_BLOCK_CLASS_NAME = "slate-block";

export const SLATE_BLOCK_FOCUSED_CLASS_NAME = "slate-block-focused";

/**
 * Given a HTML element, return whether the current focus is somewhere inside
 * it.
 */
export const elmHasChildFocus = (elm: HTMLElement): boolean =>
  !isServer() && elm.contains(window.getSelection().focusNode);
