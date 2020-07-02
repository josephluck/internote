import {
  faBold,
  faBook,
  faCode,
  faEye,
  faHeading,
  faItalic,
  faList,
  faListOl,
  faListUl,
  faMicrophone,
  faParagraph,
  faPause,
  faPlay,
  faQuoteLeft,
  faSmile,
  faSpinner,
  faTag,
  faTrash,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  HeadingOneElement,
  HeadingTwoElement,
  InternoteEditorElement,
  InternoteEditorElementTypes,
  InternoteEditorMarkType,
  InternoteEditorNodeType,
} from "@internote/lib/editor-types";
import { Text } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";

import { useCreateInternoteEditor } from "./hooks";

export type InternoteSlateEditor = ReturnType<typeof useCreateInternoteEditor>;

export type InternoteEditorRenderElementProps = RenderElementProps & {
  element: InternoteEditorElement;
  isFocused: boolean;
};

export type InternoteEditorRenderLeafProps = RenderLeafProps & {
  leaf: Text & Record<InternoteEditorMarkType, boolean>;
};

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

export type OutlineElement = {
  path: any;
  element: HeadingOneElement | HeadingTwoElement;
  key: string;
  type: InternoteEditorElementTypes;
  text: string;
};

export type ToolbarFunctions =
  | "outline"
  | "speech"
  | "dictionary"
  | "delete"
  | "emoji";

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
  emoji: "Emoji",
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
  emoji: "ctrl+e",
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
  emoji: <FontAwesomeIcon icon={faSmile} />,
};
