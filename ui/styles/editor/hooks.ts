import { useMemo } from "react";
import { withHistory } from "slate-history";
import { withReact, useSlate } from "slate-react";
import { createEditor } from "slate";
import { InternoteSlateEditor } from "./types";

export const useCreateInternoteEditor = () =>
  useMemo(() => withHistory(withReact(createEditor())), []);

export const useInternoteEditor = (): InternoteSlateEditor => {
  const editor = useSlate();
  return editor as InternoteSlateEditor;
};
