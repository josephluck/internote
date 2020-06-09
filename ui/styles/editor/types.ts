import { useCreateInternoteEditor } from "./hooks";

export type InternoteSlateEditor = ReturnType<typeof useCreateInternoteEditor>;

export type MarkType = "bold" | "italic" | "underline" | "code";

export type BlockType =
  | "numbered-list"
  | "bulleted-list"
  | "heading-one"
  | "heading-two"
  | "block-quote";

export type SlateNodeType = MarkType | BlockType;
