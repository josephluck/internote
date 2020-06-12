import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { createContext, useCallback, useContext, useMemo } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { useSlate, withReact } from "slate-react";
import { isNavigationShortcut } from "./hotkeys";
import { getWordRangeUnderCursor } from "./selection";
import {
  getEmojiSearchShortcut,
  getHashtagSearchShortcut,
  withShortcuts,
} from "./shortcuts";
import { InternoteSlateEditor } from "./types";

export const useCreateInternoteEditor = () =>
  useMemo(() => withHistory(withShortcuts(withReact(createEditor()))), []);

interface InternoteEditorContext {
  editor: InternoteSlateEditor;
  emojiSearchText: string;
  hashtagSearchText: string;
  hasSmartSearch: boolean;
  handlePreventKeydown: (event: React.KeyboardEvent) => void;
  replaceSmartSearchText: (withText: string) => void;
}

export const InternoteEditorCtx = createContext<InternoteEditorContext>({
  editor: null,
  emojiSearchText: "",
  hashtagSearchText: "",
  hasSmartSearch: false,
  handlePreventKeydown: () => void null,
  replaceSmartSearchText: () => void null,
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

  const hasSmartSearch = [emojiSearchText, hashtagSearchText].some(
    (val) => val.length > 0
  );

  const handlePreventKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      if (hasSmartSearch && isNavigationShortcut(event)) {
        event.preventDefault();
      }
    },
    [hasSmartSearch]
  );

  const replaceSmartSearchText = useCallback(
    (withText: string) => {
      const searchText = emojiSearchText || hashtagSearchText;
      if (hasSmartSearch && searchText) {
        pipe(
          getWordRangeUnderCursor(editor, true),
          O.map((_range) => {
            // TODO: delete the range somehow without collapsing blocks
            // currently this does not delete the smart search forwards if the
            // user is focused in the middle of the search.
            Editor.deleteBackward(editor, { unit: "word" });
            Editor.deleteBackward(editor, { unit: "character" });
            Transforms.insertText(editor, withText);
          })
        );
      }
    },
    [editor, hasSmartSearch, emojiSearchText, hashtagSearchText]
  );

  const ctx: InternoteEditorContext = {
    editor,
    emojiSearchText,
    hashtagSearchText,
    hasSmartSearch,
    handlePreventKeydown,
    replaceSmartSearchText,
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
