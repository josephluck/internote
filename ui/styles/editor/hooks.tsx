import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { useSlate, withReact } from "slate-react";
import { isNavigationShortcut } from "./hotkeys";
import { getSelectedBlockText, getSelectedText } from "./selection";
import {
  getEmojiSearchShortcut,
  getHashtagSearchShortcut,
  withShortcuts,
} from "./shortcuts";
import { InternoteSlateEditor } from "./types";
import { InternoteEditorElement } from "@internote/lib/editor-types";
import { withVoids } from "./voids";
import { withInlines } from "./inlines";
import { withIOCollaboration } from "@slate-collaborative/client";

// TODO: from env
const origin = "http://localhost:9000";

export const COLLABORATION_ENABLED = false;

// TODO: does switching notes work? Can this be done without resorting to a plugin?
const withCollaboration = (noteId: string) => <T extends Editor>(
  editor: T
): T =>
  COLLABORATION_ENABLED
    ? withIOCollaboration(editor, {
        docId: `/${noteId}`,
        url: `${origin}/${noteId}`,
        connectOpts: {
          query: {
            token: "some-authentication-token", // The authentication token
            noteId,
          },
        },
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log("Disconnected"),
      })
    : editor;

// TODO: use function application
export const useCreateInternoteEditor = (noteId: string) =>
  useMemo(
    () =>
      withCollaboration(noteId)(
        withHistory(
          withInlines(withVoids(withShortcuts(withReact(createEditor()))))
        )
      ),
    []
  );

interface InternoteEditorContext {
  /** The raw editor (with plugins attached) */
  editor: InternoteSlateEditor;
  /** The search text of the emoji search i.e. :heart */
  emojiSearchText: O.Option<string>;
  /** The search text of the hashtag search i.e. #reactjs */
  hashtagSearchText: O.Option<string>;
  /** Either the selected text of the current block's text */
  speechText: O.Option<string>;
  /** The selected text */
  selectedText: O.Option<string>;
  /** Whether there's any smart search going on */
  hasSmartSearch: boolean;
  handlePreventKeydown: (event: React.KeyboardEvent) => void;
  replaceSmartSearchText: (
    replacement: string | InternoteEditorElement
  ) => void;
}

export const InternoteEditorCtx = createContext<InternoteEditorContext>({
  editor: null,
  emojiSearchText: O.none,
  hashtagSearchText: O.none,
  speechText: O.none,
  selectedText: O.none,
  hasSmartSearch: false,
  handlePreventKeydown: () => void null,
  replaceSmartSearchText: () => void null,
});

export const InternoteEditorProvider: React.FunctionComponent = ({
  children,
}) => {
  const editor = useGetInternoteEditor();

  const emojiSearchText = pipe(getEmojiSearchShortcut(editor));

  const hashtagSearchText = pipe(getHashtagSearchShortcut(editor));

  const hasSmartSearch = [emojiSearchText, hashtagSearchText].some((val) =>
    pipe(val, O.isSome)
  );

  const selectedText = pipe(getSelectedText(editor));

  const speechText = pipe(
    selectedText,
    O.fold(() => getSelectedBlockText(editor), O.some)
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
        Editor.deleteBackward(editor, { unit: "word" });
        Editor.deleteBackward(editor, { unit: "character" });
        if (typeof replacement === "string") {
          Transforms.insertText(editor, replacement);
        } else {
          Transforms.insertNodes(editor, [replacement]);
          Transforms.move(editor); // NB: this refocuses after the insertion
        }
      }
    },
    [editor, hasSmartSearch, emojiSearchText, hashtagSearchText]
  );

  const ctx: InternoteEditorContext = {
    editor,
    emojiSearchText,
    hashtagSearchText,
    speechText,
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

export const useCurrentSelection = () => {
  const { editor } = useInternoteEditor();
  const [selection, setSelection] = useState(editor.selection);

  useEffect(() => {
    setSelection(editor.selection);
  }, [editor.selection]);

  return selection;
};

export const useGetInternoteEditor = (): InternoteSlateEditor => {
  const editor = useSlate();
  return editor as InternoteSlateEditor;
};
