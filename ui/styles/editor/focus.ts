import { useRef, useCallback } from "react";
import { ReactEditor } from "slate-react";
import { InternoteSlateEditor } from "./types";
import { Editor } from "slate";

/**
 * Provides useful utilities for dealing with node focus
 */
export const useNodeFocus = (editor: InternoteSlateEditor) => {
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const getCurrentFocusedNode = useCallback(() => {
    const { selection } = editorRef.current;
    const [currentNode] = Editor.node(editorRef.current, selection);
    return currentNode;
  }, []);

  const getCurrentFocusedHTMLLeaf = useCallback(
    () => ReactEditor.toDOMNode(editorRef.current, getCurrentFocusedNode()),
    [getCurrentFocusedNode]
  );

  const getCurrentFocusedHTMLNode = useCallback(
    () => findAncestor(getCurrentFocusedHTMLLeaf(), SLATE_BLOCK_CLASS_NAME),
    [getCurrentFocusedHTMLLeaf]
  );

  return {
    getCurrentFocusedNode,
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
