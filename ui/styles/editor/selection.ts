import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { getCurrentFocusedHTMLNodeTextContent } from "./focus";
import { InternoteSlateEditor } from "./types";
import { Range } from "slate";
import { ReactEditor } from "slate-react";

export const getEditorRange = (editor: InternoteSlateEditor): O.Option<Range> =>
  O.fromNullable(editor.selection);

/**
 * Returns the text in the current selected (highlighted) text.
 * If there's no selection, returns none
 */
export const getSelectedText = (
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getEditorRange(editor),
    O.filter((range) => range.focus.offset !== range.anchor.offset),
    O.filterMap(extractTextFromSlateSelection(editor))
  );

export const extractTextFromSlateSelection = (editor: InternoteSlateEditor) => (
  range: Range
): O.Option<string> =>
  pipe(
    O.tryCatch(() => ReactEditor.toDOMRange(editor, range)),
    // TODO: clone and expand selection to start and end of anchor / focus nodes
    // as otherwise the user can lookup part of a word when the word is not fully
    // selected
    O.mapNullable((domRange) => domRange.cloneContents()),
    O.mapNullable((fragment) => fragment.textContent),
    O.filter((text) => text.length > 0)
  );

/**
 * Returns the current selected (highlighted) text, or the current block's
 * text if there's no selection
 */
export const getSelectedTextOrBlockText = (editor: InternoteSlateEditor) =>
  pipe(
    getSelectedText(editor),
    O.fold(() => getCurrentFocusedHTMLNodeTextContent(editor), O.some)
  );

/**
 * Returns the word under the cursor.
 * Returns none if there's a highlighted region under the cursor (i.e. the user has
 * selected multiple words)
 */
export const getWordUnderCursor = (
  _editor: InternoteSlateEditor
): O.Option<string> => O.none;

/**
 * Returns the first word in the current selected (highlighted) text, or the
 * word under the cursor.
 */
export const getHighlightedWord = (
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getSelectedText(editor),
    O.filterMap(getFirstWordFromString),
    O.fold(() => getWordUnderCursor(editor), O.some)
  );

export const getFirstWordFromString = (str: string): O.Option<string> =>
  O.fromNullable(str.split(" ")[0]);
