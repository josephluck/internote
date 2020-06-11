import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Range as SlateRange, Point as SlatePoint, Editor } from "slate";
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
    O.tryCatch(() => Editor.string(editor, range)),
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
 * Returns none if there's a highlighted region under the cursor (i.e. the user
 * has selected multiple words)
 *
 * NB: includePrecedingCharacter extends the selection to include the character
 * to the left of the full word. This is necessary because Slate's expansion of
 * a range does not include special characters.
 */
export const getWordUnderCursor = (
  editor: InternoteSlateEditor,
  includePrecedingCharacter: boolean = false
): O.Option<string> =>
  pipe(
    getEditorRange(editor),
    O.filter((range) => range.focus.offset === range.anchor.offset),
    O.filterMap(
      extractExpandedTextFromSlateRange(editor, includePrecedingCharacter)
    ),
    O.map((text) => text.trim()),
    O.filter((text) => text.length > 0)
  );

/**
 * Expands a slate range to include surrounding full word and extracts the text
 * content from it
 */
export const extractExpandedTextFromSlateRange = (
  editor: InternoteSlateEditor,
  includePrecedingCharacter: boolean = false
) => (range: SlateRange): O.Option<string> =>
  pipe(
    O.tryCatch(() => expandRangeToFullWord(editor, range)),
    O.map((range) =>
      includePrecedingCharacter
        ? expandRangeToPrecedingCharacter(editor, range)
        : range
    ),
    O.filterMap((range) => O.tryCatch(() => Editor.string(editor, range)))
  );

/**
 * Expands a slate range to include full words
 */
const expandRangeToFullWord = (
  editor: InternoteSlateEditor,
  range: SlateRange
): SlateRange => ({
  anchor: Editor.before(editor, range, {
    unit: "word",
  }),
  focus: Editor.after(editor, range, { unit: "word" }),
});

/**
 * Expands a slate range to include the character immediately to the left
 */
const expandRangeToPrecedingCharacter = (
  editor: InternoteSlateEditor,
  range: SlateRange
): SlateRange => ({
  anchor: expandPointToPrecedingCharacter(editor, range.anchor),
  focus: range.focus,
});

const expandPointToPrecedingCharacter = (
  editor: InternoteSlateEditor,
  point: SlatePoint
): SlatePoint =>
  Editor.before(editor, point, {
    unit: "character",
  });

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
