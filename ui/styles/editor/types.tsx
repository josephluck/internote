import { useCreateInternoteEditor } from "./hooks";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { Element, Text } from "slate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faCode,
  faHeading,
  faQuoteLeft,
  faListUl,
  faListOl,
  faEye,
  faBook,
  faSpinner,
  faMicrophone,
  faPause,
  faPlay,
  faTrash,
  faList,
  faParagraph,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

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

export const marks: InternoteEditorMarkType[] = [
  "bold",
  "italic",
  "underline",
  "code",
];

export const toolbarBlocks: InternoteEditorElementTypes[] = [
  "heading-one",
  "heading-two",
  "bulleted-list",
  "numbered-list",
  "block-quote",
];

export type InternoteEditorNodeType =
  | InternoteEditorMarkType
  | InternoteEditorElementTypes;

export type InternoteEditorRenderElementProps = RenderElementProps & {
  element: InternoteEditorElement;
  isFocused: boolean;
};

export type InternoteEditorRenderLeafProps = RenderLeafProps & {
  leaf: Text & Record<InternoteEditorMarkType, boolean>;
};

export type ToolbarFunctions = "outline" | "speech" | "dictionary" | "delete";

export type ToolbarFunctionStates =
  | "speech-loading"
  | "speech-playing"
  | "speech-paused"
  | "dictionary-loading";

export type ToolbarIconType =
  | InternoteEditorNodeType
  | ToolbarFunctions
  | ToolbarFunctionStates;

export const voids: InternoteEditorNodeType[] = ["tag"];

export const inlines: InternoteEditorNodeType[] = ["tag"];

export const toolbarLabelMap: Record<
  InternoteEditorNodeType | ToolbarFunctions,
  string
> = {
  paragraph: "Paragraph",
  "heading-one": "Heading",
  "heading-two": "Subheading",
  code: "Code",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  "numbered-list": "Numbers",
  "bulleted-list": "Bullets",
  "block-quote": "Quote",
  "list-item": "List",
  tag: "Tag",
  outline: "Outline",
  speech: "Speech",
  dictionary: "Dictionary",
  delete: "Delete",
};

// TODO: chromebook can't use mod?
export const toolbarShortcutMap: Record<
  InternoteEditorNodeType | ToolbarFunctions,
  string | string[]
> = {
  paragraph: "ctrl+p",
  "heading-one": "ctrl+h",
  "heading-two": "ctrl+j",
  code: "ctrl+`",
  bold: "ctrl+b",
  italic: "ctrl+i",
  underline: "ctrl+u",
  "numbered-list": "ctrl+shift+l",
  "bulleted-list": "ctrl+l",
  "block-quote": "ctrl+>",
  "list-item": [],
  tag: "ctrl+#",
  outline: "ctrl+shift+o",
  speech: "ctrl+s",
  dictionary: "ctrl+d",
  delete: "ctrl+shift+d",
};

export const toolbarIconMap: Record<ToolbarIconType, React.ReactNode> = {
  bold: <FontAwesomeIcon icon={faBold} />,
  italic: <FontAwesomeIcon icon={faItalic} />,
  underline: <FontAwesomeIcon icon={faUnderline} />,
  code: <FontAwesomeIcon icon={faCode} />,
  "heading-one": <FontAwesomeIcon icon={faHeading} />,
  "heading-two": "H2", // TODO: find an icon for representing heading-two
  "block-quote": <FontAwesomeIcon icon={faQuoteLeft} />,
  "bulleted-list": <FontAwesomeIcon icon={faListUl} />,
  "numbered-list": <FontAwesomeIcon icon={faListOl} />,
  outline: <FontAwesomeIcon icon={faEye} />,
  dictionary: <FontAwesomeIcon icon={faBook} />,
  "dictionary-loading": <FontAwesomeIcon icon={faSpinner} spin />,
  speech: <FontAwesomeIcon icon={faMicrophone} />,
  "speech-loading": <FontAwesomeIcon icon={faSpinner} spin />,
  "speech-playing": <FontAwesomeIcon icon={faPause} />,
  "speech-paused": <FontAwesomeIcon icon={faPlay} />,
  tag: <FontAwesomeIcon icon={faTag} />,
  paragraph: <FontAwesomeIcon icon={faParagraph} />,
  "list-item": <FontAwesomeIcon icon={faList} />,
  delete: <FontAwesomeIcon icon={faTrash} />,
};
