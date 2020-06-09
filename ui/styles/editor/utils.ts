import { InternoteSlateEditor, SlateNodeType } from "./types";
import { Transforms, Editor } from "slate";

const LIST_TYPES: SlateNodeType[] = ["numbered-list", "bulleted-list"];

export const toggleBlock = (
  editor: InternoteSlateEditor,
  format: SlateNodeType
) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (node) => LIST_TYPES.includes(node.type as any), // TODO: strongly type
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const toggleMark = (
  editor: InternoteSlateEditor,
  format: SlateNodeType
) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (
  editor: InternoteSlateEditor,
  format: SlateNodeType
) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

export const isMarkActive = (
  editor: InternoteSlateEditor,
  format: SlateNodeType
) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
