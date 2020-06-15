import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { createContext, useCallback, useContext, useMemo } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { useSlate, withReact } from "slate-react";
import { isNavigationShortcut } from "./hotkeys";
import {
  getSelectedTextOrBlockText,
  getWordRangeUnderCursor,
} from "./selection";
import {
  getEmojiSearchShortcut,
  getHashtagSearchShortcut,
  withShortcuts,
} from "./shortcuts";
import { InternoteEditorElement, InternoteSlateEditor } from "./types";
import { withVoids } from "./voids";
import { withInlines } from "./inlines";

// TODO: use function application
export const useCreateInternoteEditor = () =>
  useMemo(
    () =>
      withHistory(
        withInlines(withVoids(withShortcuts(withReact(createEditor()))))
      ),
    []
  );

interface InternoteEditorContext {
  editor: InternoteSlateEditor;
  emojiSearchText: string;
  hashtagSearchText: string;
  selectedText: string;
  hasSmartSearch: boolean;
  handlePreventKeydown: (event: React.KeyboardEvent) => void;
  replaceSmartSearchText: (
    replacement: string | InternoteEditorElement
  ) => void;
}

export const InternoteEditorCtx = createContext<InternoteEditorContext>({
  editor: null,
  emojiSearchText: "",
  hashtagSearchText: "",
  selectedText: "",
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

  const selectedText = pipe(
    getSelectedTextOrBlockText(editor),
    O.getOrElse(() => "")
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
    (replacement: string | InternoteEditorElement) => {
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
            if (typeof replacement === "string") {
              Transforms.insertText(editor, replacement);
            } else {
              Transforms.insertNodes(editor, [replacement]);
            }
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
    selectedText,
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
