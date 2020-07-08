import { Element } from "slate";

export type InternoteEditorValue = InternoteEditorElement[];

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
export type LinkElement = BaseElement<{
  type: "link";
  href: string;
}>;

export type InternoteEditorElement =
  | TagElement
  | LinkElement
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
