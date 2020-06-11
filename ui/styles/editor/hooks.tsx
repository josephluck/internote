import { useMemo, createContext, useContext } from "react";
import { withHistory } from "slate-history";
import { withReact, useSlate } from "slate-react";
import { createEditor } from "slate";
import { InternoteSlateEditor } from "./types";
import {
  withShortcuts,
  getEmojiSearchShortcut,
  getHashtagSearchShortcut,
} from "./shortcuts";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

export const useCreateInternoteEditor = () =>
  useMemo(() => withHistory(withShortcuts(withReact(createEditor()))), []);

interface InternoteEditorContext {
  editor: InternoteSlateEditor;
  emojiSearchText: string;
  hashtagSearchText: string;
}

export const InternoteEditorCtx = createContext<InternoteEditorContext>({
  editor: null,
  emojiSearchText: "",
  hashtagSearchText: "",
});

export const InternoteEditorProvider: React.FunctionComponent = ({
  children,
}) => {
  const editor = useGetInternoteEditor();

  const emojiSearchText = pipe(
    getEmojiSearchShortcut(editor),
    O.getOrElse(() => "")
  );

  const hashtagSearchText = pipe(
    getHashtagSearchShortcut(editor),
    O.getOrElse(() => "")
  );

  const ctx: InternoteEditorContext = {
    editor,
    emojiSearchText,
    hashtagSearchText,
  };

  return (
    <InternoteEditorCtx.Provider value={ctx}>
      {children}
    </InternoteEditorCtx.Provider>
  );
};

export const useInternoteEditor = () => useContext(InternoteEditorCtx);

export const useGetInternoteEditor = (): InternoteSlateEditor => {
  const editor = useSlate();
  return editor as InternoteSlateEditor;
};
