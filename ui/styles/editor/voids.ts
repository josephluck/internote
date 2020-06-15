import { Editor } from "slate";
import { InternoteEditorNodeType, voids } from "./types";

export const withVoids = <T extends Editor>(editor: T): T => {
  const { isVoid } = editor;

  editor.isVoid = (element) =>
    isVoid(element) || voids.includes(element.type as InternoteEditorNodeType);

  return editor;
};
