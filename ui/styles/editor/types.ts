import { useCreateInternoteEditor } from "./hooks";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { Element, Text } from "slate";

export type InternoteSlateEditor = ReturnType<typeof useCreateInternoteEditor>;

type BaseElement<T> = Element & T;
type VoidElement<T> = BaseElement<T> & { children: [] };

export type ParagraphElement = BaseElement<{ type: "paragraph" }>;
export type NumberedListElement = BaseElement<{ type: "numbered-list" }>;
export type BulletedListElement = BaseElement<{ type: "bulleted-list" }>;
export type HeadingOneElement = BaseElement<{ type: "heading-one" }>;
export type HeadingTwoElement = BaseElement<{ type: "heading-two" }>;
export type BlockQuoteElement = BaseElement<{ type: "block-quote" }>;
export type ListItemElement = BaseElement<{ type: "list-item" }>;
export type TagElement = VoidElement<{ type: "tag"; tag: string }>;

export type InternoteEditorElement =
  | TagElement
  | ParagraphElement
  | NumberedListElement
  | BulletedListElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | ListItemElement;

export type InternoteEditorElementTypes = InternoteEditorElement["type"];

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
