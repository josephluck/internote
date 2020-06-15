import { useCreateInternoteEditor } from "./hooks";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { Element, Text } from "slate";

export type InternoteSlateEditor = ReturnType<typeof useCreateInternoteEditor>;

type BaseElement<T> = Element & T;
type VoidElement<T> = BaseElement<T> & { children: [] };

type ParagraphElement = BaseElement<{ type: "paragraph" }>;
type NumberedListElement = BaseElement<{ type: "numbered-list" }>;
type BulletedListElement = BaseElement<{ type: "bulleted-list" }>;
type HeadingOneElement = BaseElement<{ type: "heading-one" }>;
type HeadingTwoElement = BaseElement<{ type: "heading-two" }>;
type BlockQuoteElement = BaseElement<{ type: "block-quote" }>;
type ListItemElement = BaseElement<{ type: "list-item" }>;
type TagElement = VoidElement<{ type: "tag"; tag: string }>;

export type InternoteEditorElement =
  | TagElement
  | ParagraphElement
  | NumberedListElement
  | BulletedListElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | ListItemElement;

type InternoteEditorElementTypes = InternoteEditorElement["type"];

export type InternoteEditorMarkType = "bold" | "italic" | "underline" | "code";

export type InternoteEditorNodeType =
  | InternoteEditorMarkType
  | InternoteEditorElementTypes;

export type InternoteEditorRenderElementProps = RenderElementProps & {
  element: InternoteEditorElement;
};

export type InternoteEditorRenderLeafProps = RenderLeafProps & {
  leaf: Text & Record<InternoteEditorMarkType, boolean>;
};

export const voids: InternoteEditorNodeType[] = ["tag"];

export const inlines: InternoteEditorNodeType[] = ["tag"];
