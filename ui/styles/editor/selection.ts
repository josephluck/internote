import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Range as SlateRange, Point as SlatePoint, Editor, Point } from "slate";
import { InternoteSlateEditor } from "./types";
import { InternoteEditorElement } from "@internote/lib/editor-types";

/**
 * Get the current selection from the editor normalized such that the anchor
 * is guaranteed to be before the focus.
 *
 * This is useful for consistent ranges no matter which direction the user has
 * selected in.
 */
export const getNormalizedEditorRange = (
  editor: InternoteSlateEditor
): O.Option<SlateRange> =>
  pipe(
    O.fromNullable(editor.selection),
    O.map(({ anchor, focus }) => ({
      anchor: Point.isBefore(anchor, focus) ? anchor : focus,
      focus: Point.isAfter(focus, anchor) ? focus : anchor,
    }))
  );

/**
 * Returns the text in the current selected (highlighted) text.
 * If there's no selection, returns none
 */
export const getSelectedText = (
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getNormalizedEditorRange(editor),
    O.filter((range) => range.focus.offset !== range.anchor.offset),
    O.filterMap((range) => getExpandedRangeToFullWord(editor, range, false)),
    O.filterMap((range) => extractTextFromSlateRange(editor, range))
  );

/**
 * Returns the current selected (highlighted) text, or the current block's
 * text if there's no selection
 */
export const getSelectedBlockText = (
  editor: InternoteSlateEditor
): O.Option<string> =>
  pipe(
    getRangeOfCurrentSelectionBlock(editor),
    O.filterMap((range) => extractTextFromSlateRange(editor, range))
  );

/**
 * Given a slate range, extract it's contents
 */
export const extractTextFromSlateRange = (
  editor: InternoteSlateEditor,
  range: SlateRange
): O.Option<string> =>
  pipe(
    O.tryCatch(() => Editor.string(editor, range)),
    O.filter((text) => text.length > 0)
  );

/**
 * Returns the range of the word under the cursor.
 * Returns none if there's a highlighted region under the cursor (i.e. the user
 * has selected multiple words). Also returns none if the word is empty.
 *
 * NB: includePrecedingCharacter extends the selection to include the character
 * to the left of the full word. This is necessary because Slate's expansion of
 * a range does not include special characters.
 */
export const getWordRangeUnderCursor = (
  editor: InternoteSlateEditor,
  includePrecedingCharacter: boolean
): O.Option<SlateRange> =>
  pipe(
    getNormalizedEditorRange(editor),
    O.filter((range) => range.focus.offset === range.anchor.offset),
    O.filterMap((range) =>
      getExpandedRangeToFullWord(editor, range, includePrecedingCharacter)
    )
  );

/**
 * Returns the text of the word under the cursor.
 * Returns none if there's a highlighted region under the cursor (i.e. the user
 * has selected multiple words). Also returns none if the word is empty.
 *
 * NB: includePrecedingCharacter extends the selection to include the character
 * to the left of the full word. This is necessary because Slate's expansion of
 * a range does not include special characters.
 */
export const getWordTextUnderCursor = (
  editor: InternoteSlateEditor,
  includePrecedingCharacter: boolean = false
): O.Option<string> =>
  pipe(
    getWordRangeUnderCursor(editor, includePrecedingCharacter),
    O.filterMap((range) => getTextFromSlateRange(editor, range)),
    O.map((text) => text.trim()),
    O.filter((text) => text.length > 0)
  );

const getTextFromSlateRange = (
  editor: InternoteSlateEditor,
  range: SlateRange
): O.Option<string> => O.tryCatch(() => Editor.string(editor, range));

/**
 * Given a slate range, provide the array of nodes within the range
 */
export const getNodesFromSlateRange = (
  editor: InternoteSlateEditor,
  range: SlateRange
): O.Option<InternoteEditorElement[]> =>
  pipe(
    O.tryCatch(() => Editor.fragment(editor, range)),
    O.map((nodes) => Array.from(nodes)),
    O.map((nodes) => nodes.map((node) => node as InternoteEditorElement))
  );

/**
 * Gets the array of nodes within the editor's current selection
 */
export const getNodesFromEditorSelection = (
  editor: InternoteSlateEditor
): O.Option<InternoteEditorElement[]> =>
  pipe(
    O.fromNullable(editor.selection),
    O.filterMap((range) => getNodesFromSlateRange(editor, range))
  );

/**
 * Expands a slate range to include surrounding full words
 */
export const getExpandedRangeToFullWord = (
  editor: InternoteSlateEditor,
  range: SlateRange,
  includePrecedingCharacter: boolean
): O.Option<SlateRange> =>
  pipe(
    O.tryCatch(() => expandRangeToFullWord(editor, range)),
    O.filterMap((range) =>
      includePrecedingCharacter
        ? expandRangeToPrecedingCharacter(editor, range)
        : O.some(range)
    )
  );

/**
 * Gets the editors current range and extends it to include surrounding full
 * block.
 *
 * TODO: depending on the marks in the block and whether it's the last block in
 * the document or not, sometimes the focus expansion fails.
 */
export const getRangeOfCurrentSelectionBlock = (editor: InternoteSlateEditor) =>
  pipe(
    getNormalizedEditorRange(editor),
    O.map((range) => getExpandedRangeToFullBlock(editor, range))
  );

/**
 * Takes a slate range and expands it to start and end at a full block
 */
const getExpandedRangeToFullBlock = (
  editor: InternoteSlateEditor,
  { anchor, focus }: SlateRange
): SlateRange => ({
  anchor: pipe(
    O.tryCatch(() => Editor.before(editor, anchor, { unit: "block" })),
    O.filter(Boolean),
    O.getOrElse(() => anchor)
  ),
  focus: pipe(
    O.tryCatch(() => Editor.after(editor, focus, { unit: "block" })),
    O.filter(Boolean),
    O.getOrElse(() => focus)
  ),
});

/**
 * Expands a slate range to include full words.
 * NB: only expands a side if it is not already at the start of the word.
 */
const expandRangeToFullWord = (
  editor: InternoteSlateEditor,
  range: SlateRange
): SlateRange => ({
  anchor: pipe(
    buildRangeOfPrecedingCharacter(editor, range.anchor),
    O.filterMap((range) => getTextFromSlateRange(editor, range)),
    O.filter((character) => character !== " "),
    O.map(() =>
      Editor.before(editor, range.anchor, {
        unit: "word",
      })
    ),
    O.filter(Boolean),
    O.getOrElse(() => range.anchor)
  ),
  focus: pipe(
    buildRangeOfNextCharacter(editor, range.focus),
    O.filterMap((range) => getTextFromSlateRange(editor, range)),
    O.filter((character) => character !== " "),
    O.map(() => Editor.after(editor, range.focus, { unit: "word" })),
    O.filter(Boolean),
    O.getOrElse(() => range.focus)
  ),
});

/**
 * Expands a slate range to include the character immediately to the left
 */
const expandRangeToPrecedingCharacter = (
  editor: InternoteSlateEditor,
  range: SlateRange
): O.Option<SlateRange> =>
  pipe(
    expandPointToPrecedingCharacter(editor, range.anchor),
    O.map((anchor) => ({ anchor, focus: range.focus }))
  );

const expandPointToPrecedingCharacter = (
  editor: InternoteSlateEditor,
  point: SlatePoint
): O.Option<SlatePoint> =>
  pipe(
    O.tryCatch(() =>
      Editor.before(editor, point, {
        unit: "character",
      })
    ),
    O.filter((point) => Boolean(point))
  );

const expandPointToNextCharacter = (
  editor: InternoteSlateEditor,
  point: SlatePoint
): O.Option<SlatePoint> =>
  pipe(
    O.tryCatch(() =>
      Editor.after(editor, point, {
        unit: "character",
      })
    ),
    O.filter((point) => Boolean(point))
  );

/**
 * Given a point, build a slate range consisting of an anchor of the character
 * immediately to the left and the focus as the point
 */
const buildRangeOfPrecedingCharacter = (
  editor: InternoteSlateEditor,
  point: SlatePoint
): O.Option<SlateRange> =>
  pipe(
    expandPointToPrecedingCharacter(editor, point),
    O.map((anchor) => ({ anchor, focus: point }))
  );

/**
 * Given a point, build a slate range consisting of an anchor of the character
 * immediately to the left and the focus as the point
 */
const buildRangeOfNextCharacter = (
  editor: InternoteSlateEditor,
  point: SlatePoint
): O.Option<SlateRange> =>
  pipe(
    expandPointToNextCharacter(editor, point),
    O.map((focus) => ({ anchor: point, focus }))
  );

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
    O.fold(() => getWordTextUnderCursor(editor), O.some)
  );

export const getFirstWordFromString = (str: string): O.Option<string> =>
  O.fromNullable(str.split(" ")[0]);
