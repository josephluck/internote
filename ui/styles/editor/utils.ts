import { Editor, Transforms, Node } from "slate";
import { OutlineElement } from "./types";
import {
  InternoteEditorElement,
  InternoteEditorElementTypes,
  InternoteEditorNodeType,
  TagElement,
  HeadingOneElement,
  HeadingTwoElement,
} from "@internote/lib/editor-types";

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
  value.reduce((prev, element) => {
    const elements = element.children
      ? flattenEditorElements(element.children as InternoteEditorElement[])
      : [];
    return [...prev, element, ...elements];
  }, []);

export const extractAllTagElementsFromValue = (
  value: InternoteEditorElement[]
): TagElement[] =>
  filterElementsOfType(["tag"])(flattenEditorElements(value)) as TagElement[];

export const extractAllHeadingElementsFromValue = (
  value: InternoteEditorElement[]
): (HeadingOneElement | HeadingTwoElement)[] =>
  filterElementsOfType(["heading-one", "heading-two"])(
    flattenEditorElements(value)
  ) as (HeadingOneElement | HeadingTwoElement)[];

export const extractOutlineFromValue = (
  value: InternoteEditorElement[]
): OutlineElement[] =>
  extractAllHeadingElementsFromValue(value)
    .filter((heading) => !!heading.children && heading.children.length > 0)
    .map((heading, i) => ({
      path: undefined,
      key: i.toString(),
      text: Array.from(Node.texts(heading))
        .map(([text]) => text.text)
        .filter(Boolean)
        .join(" "),
      element: heading,
      type: heading.type,
    }))
    .filter((heading) => heading.text.length > 0);

/**
 * NB: expects a flattened list of editor elements. If your structure is nested,
 * refer to flattenEditorElements
 */
const filterElementsOfType = (types: InternoteEditorElementTypes[]) => (
  value: InternoteEditorElement[]
): InternoteEditorElement[] =>
  value
    .filter((node) => types.includes(node.type))
    .filter(Boolean) as InternoteEditorElement[];

/**
 * Shallow de-duplicates an array
 */
const dedupe = <T>(arr: T[]): T[] => [...new Set(arr)];

const DEFAULT_NOTE_TITLE = "Welcome to Internote";
