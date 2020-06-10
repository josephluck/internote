import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Range as SlateRange } from "slate";
import { ReactEditor } from "slate-react";
import { getCurrentFocusedHTMLNodeTextContent } from "./focus";
import { InternoteSlateEditor } from "./types";

export const getEditorRange = (
  editor: InternoteSlateEditor
): O.Option<SlateRange> => O.fromNullable(editor.selection);

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
    O.filterMap(extractTextFromSlateRange(editor))
  );

export const extractTextFromSlateRange = (editor: InternoteSlateEditor) => (
  range: SlateRange
): O.Option<string> =>
  pipe(
    O.tryCatch(() => ReactEditor.toDOMRange(editor, range)),
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
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getEditorRange(editor),
    O.filter((range) => range.focus.offset === range.anchor.offset),
    O.filterMap(extractTextFromSlateRangeOffset(editor))
  );

export const extractTextFromSlateRangeOffset = (
  editor: InternoteSlateEditor
) => (range: SlateRange): O.Option<string> =>
  pipe(
    O.tryCatch(() => ReactEditor.toDOMRange(editor, range)),
    O.filterMap(extractWordFromRangeStartOffset)
  );

/**
 * Given a DOM range, find the word under the start offset of the range.
 */
const extractWordFromRangeStartOffset = (range: Range): O.Option<string> => {
  const text = range.startContainer.textContent;
  const offset = range.startOffset;

  const expandedStartBoundary = findOffsetOfPreviousSpace(offset, text);
  const expandedEndBoundary = findOffsetOfNextSpace(offset, text);

  const word = text.slice(expandedStartBoundary, expandedEndBoundary);

  return O.fromNullable(word);
};

/**
 * Given a starting offset and a block of text, find the offset of the closest
 * leftmost space
 */
const findOffsetOfPreviousSpace = (offset: number, text: string) => {
  if (offset === 0) {
    return 0;
  } else if (text.charAt(offset - 1).match(/\s/g)) {
    return offset;
  } else {
    return findOffsetOfPreviousSpace(offset - 1, text);
  }
};

/**
 * Given a starting offset and a block of text, find the offset of the closest
 * rightmost space
 */
const findOffsetOfNextSpace = (offset: number, text: string) => {
  if (offset === text.length) {
    return text.length;
  } else if (text.charAt(offset).match(/\s/g)) {
    return offset;
  } else {
    return findOffsetOfNextSpace(offset + 1, text);
  }
};

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
