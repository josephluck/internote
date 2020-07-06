import { InternoteEditorNodeType } from "@internote/lib/editor-types";
import { Editor } from "slate";

import { inlines } from "./types";

export const withInlines = <T extends Editor>(editor: T): T => {
  const { isInline } = editor;

  editor.isInline = (element) =>
    isInline(element) ||
    inlines.includes(element.type as InternoteEditorNodeType);

  return editor;
};
