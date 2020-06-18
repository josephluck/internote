import { Editor, Transforms } from "slate";
import {
  InternoteEditorElement,
  InternoteEditorElementTypes,
  InternoteEditorNodeType,
  InternoteSlateEditor,
  TagElement,
} from "./types";

const LIST_TYPES: InternoteEditorNodeType[] = [
  "numbered-list",
  "bulleted-list",
];

export const toggleBlock = (
  editor: Editor,
  format: InternoteEditorNodeType
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

export const toggleMark = (editor: Editor, format: InternoteEditorNodeType) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (
  editor: Editor,
  format: InternoteEditorNodeType
) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

export const isMarkActive = (
  editor: Editor,
  format: InternoteEditorNodeType
) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const extractTextFromNodes = (nodes: InternoteEditorElement[]) =>
  nodes
    .map((node) => node.text)
    .filter(Boolean)
    .join("");

export const findFirstNonEmptyNodeOfType = (
  type: InternoteEditorElementTypes[]
) => (nodes: InternoteEditorElement[]) =>
  nodes.find(
    (node) =>
      type.includes(node.type) &&
      extractTextFromNodes(node.children as any).length > 0
  );

export const extractTitleFromValue = (
  value: InternoteEditorElement[]
): string => {
  const firstNode = findFirstNonEmptyNodeOfType([
    "heading-one",
    "heading-two",
    "paragraph",
  ])(value);
  return firstNode
    ? extractTextFromNodes(firstNode.children as any)
    : DEFAULT_NOTE_TITLE;
};

export const extractTagsFromValue = (
  value: InternoteEditorElement[]
): string[] =>
  dedupe(extractTagsStringsFromTags(extractAllTagElementsFromValue(value)));

export const extractTagsStringsFromTags = (tags: TagElement[]): string[] =>
  tags.map((tag) => tag.tag).filter(Boolean);

export const flattenEditorElements = (
  value: InternoteEditorElement[]
): InternoteEditorElement[] =>
  value.reduce((prev, { children, ...element }) => {
    const elements = children
      ? flattenEditorElements(children as InternoteEditorElement[])
      : [];
    return [...prev, element, ...elements];
  }, []);

export const extractAllTagElementsFromValue = (
  value: InternoteEditorElement[]
): TagElement[] => extractTagElementsFromValue(flattenEditorElements(value));

const extractTagElementsFromValue = (
  value: InternoteEditorElement[]
): TagElement[] => value.filter((node) => node.type === "tag") as TagElement[];

/**
 * Shallow de-duplicates an array
 */
const dedupe = <T>(arr: T[]): T[] => [...new Set(arr)];

const DEFAULT_NOTE_TITLE = "Welcome to Internote";
