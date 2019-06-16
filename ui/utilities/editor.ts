import { Value, Node, Range, Point, Block } from "slate";
import isKeyHotkey from "is-hotkey";
import { defaultNote } from "@internote/api/domains/note/default-note";
import { Option, Some, None } from "space-lift";
import { BlockType } from "./serializer";
import { hasLength } from "./string";

/**
 * Returns the full combined text of a block
 * including emojis, not #tags
 */
export function mapBlockToString(block: Block): string {
  return block.nodes
    .filter(
      node =>
        node.object === "text" ||
        (node.object === "inline" && node.type === "emoji")
    )
    .reduceRight((prev, node) => {
      if (node.object === "inline" && node.type === "emoji") {
        return `${node.data.get("code")} ${prev}`;
      } else if (node.text && node.text.length > 0) {
        return `${node.text} ${prev}`;
      } else {
        return prev;
      }
    }, "");
}

export function getTitleFromEditorValue(
  editorValue: Value
): string | undefined {
  if (
    editorValue.document &&
    editorValue.document.getBlocks &&
    editorValue.document.getBlocks()
  ) {
    const text = editorValue.document
      .getBlocks()
      .map(mapBlockToString)
      .find(hasLength);
    return text ? text : undefined;
  } else {
    return undefined;
  }
}

export function getTagsFromEditorValue(editorValue: Value): string[] {
  if (
    editorValue.document &&
    editorValue.document.getBlocks &&
    editorValue.document.getInlines()
  ) {
    const tags = editorValue.document
      .getInlines()
      .filter(inline => inline.type === "tag")
      .map(inline => inline.data.get("tag"))
      .toArray();
    return tags;
  } else {
    return [];
  }
}

export function isValidSlateValue(value: Object): boolean {
  return value && typeof value === "object" && value.hasOwnProperty("document");
}

export function getValueOrDefault(value: Object): Value {
  return isValidSlateValue(value)
    ? Value.fromJSON(value)
    : Value.fromJSON(defaultNote as any); // TODO: type correctly
}

export function hasSelection(value: Value) {
  return (
    value.fragment && value.fragment.text && value.fragment.text.length > 0
  );
}

export function hasFocus(value: Value) {
  return (
    value.focusBlock &&
    value.focusBlock.text &&
    value.focusBlock.text.length > 0
  );
}

export function getSelectedContent(value: Value): Option<string> {
  return hasSelection(value)
    ? Some(value.fragment.text)
    : hasFocus(value)
    ? Some(value.focusBlock.text)
    : None;
}

/**
 * Used to determine whether to render a list
 * item block as active depending on whether
 * the current focus or selection position is
 * inside a list item or not.
 */

export function currentFocusIsWithinList(
  type: BlockType,
  value: Value
): boolean {
  const isList = ["numbered-list", "bulleted-list"].includes(type);
  if (isList) {
    const firstListItem = value.blocks.first();
    if (firstListItem) {
      const outerListBlock: any = value.document.getParent(firstListItem.key);
      return (
        currentFocusHasBlock("list-item", value) &&
        outerListBlock &&
        outerListBlock.type === type
      );
    }

    return false;
  }
}

export function currentFocusHasMark(type: string, value: Value): boolean {
  return value.activeMarks.some(mark => mark.type === type);
}

export function currentFocusHasBlock(type: string, value: Value): boolean {
  return value.blocks.some(node => node.type === type);
}

function splitParagraphAtOffset(offset: number) {
  return function(paragraph: string) {
    return paragraph
      .split("")
      .slice(0, offset)
      .join("");
  };
}

function splitParagraphIntoWords(paragraph: string): string[] {
  return paragraph.split(" ");
}

function ensureArrayLength<A>(arr: A[]): boolean {
  return arr.length > 0;
}

function getLastItemFromArray<A>(arr: A[]): A {
  return arr[arr.length - 1];
}

function getCurrentFocusText(value: Value): Option<string> {
  const { focusText } = value;
  return Option(focusText)
    .filter(f => !!f.text && f.text.length > 0) // Ensure there is focus and chars
    .map(f => f.text); // Grab text from focus
}

export function getCurrentFocusedWord(value: Value): Option<string> {
  // Selection is the current block
  const { selection } = value;
  // Represents how many characters the focus is in from the left of the current text
  const { offset } = selection.focus;
  return getCurrentFocusText(value)
    .map(splitParagraphAtOffset(offset)) // Get first portion of focus text according to cursor position
    .map(splitParagraphIntoWords) // Split into individual words
    .filter(ensureArrayLength) // Ensure there's at least one word
    .map(getLastItemFromArray); // Grab the last word (which is where the cursor is)
}

export function getRangeFromWordInCurrentFocus(
  word: string,
  value: Value
): Option<Range> {
  return getCurrentFocusText(value)
    .map(text => text.indexOf(word))
    .map(start =>
      Range.create({
        anchor: Point.create({ offset: start - 1 }), // NB: word does not include the colon
        focus: Point.create({ offset: start + word.length })
      })
    );
}

export function isEmojiShortcut(word: string): boolean {
  return word.startsWith(":") && word.length > 1;
}

export function isTagShortcut(word: string): boolean {
  return word.startsWith("#") && word.length > 1;
}

/**
 * Determines whether the provided word is a shortcut
 * like an emoji or tag shortcut (: or #)
 */
export function isShortcut(word: string): boolean {
  return isEmojiShortcut(word) || isTagShortcut(word);
}

export const isH1Hotkey = isKeyHotkey("mod+1");
export const isH2Hotkey = isKeyHotkey("mod+2");
export const isOlHotkey = isKeyHotkey("mod+3");
export const isUlHotkey = isKeyHotkey("mod+4");
export const isCodeHotkey = (e: Event) => {
  return isKeyHotkey("mod+5", e) || isKeyHotkey("mod+`", e);
};
export const isQuoteHotkey = (e: Event) => {
  return isKeyHotkey("mod+6", e) || isKeyHotkey("mod+'", e);
};
export const isBoldHotkey = (e: Event) => {
  return isKeyHotkey("mod+7", e) || isKeyHotkey("mod+b", e);
};
export const isItalicHotkey = (e: Event) => {
  return isKeyHotkey("mod+8", e) || isKeyHotkey("mod+i", e);
};
export const isUnderlinedHotkey = (e: Event) => {
  return isKeyHotkey("mod+9", e) || isKeyHotkey("mod+u", e);
};
export const isCtrlHotKey = (e: Event) => {
  return isKeyHotkey("ctrl", e) || isKeyHotkey("mod", e);
};
export const isEnterHotKey = isKeyHotkey("enter");
export const isRightHotKey = isKeyHotkey("right");
export const isLeftHotKey = isKeyHotkey("left");

export function shouldPreventEventForMenuNavigationShortcut(
  event: Event,
  search: string,
  menuShowing: boolean
): boolean {
  const isNavigationShortcut =
    isRightHotKey(event) || isLeftHotKey(event) || isEnterHotKey(event);

  return search.length && menuShowing && isNavigationShortcut;
}

interface OutlineItem {
  name: string;
  key: string;
  type: BlockType;
  node: Node;
}

// TODO: single line bold
const blocksInOutline: BlockType[] = ["heading-one", "heading-two"];

export function getOutlineHeadingsFromEditorValue(value: Value): OutlineItem[] {
  return value.document
    .getBlocks()
    .filter(block => blocksInOutline.includes(block.type as any))
    .map(block => ({
      block,
      name: mapBlockToString(block)
    }))
    .filter(block => hasLength(block.name))
    .map(({ block, name }) => {
      return {
        key: block.key,
        name,
        type: block.type as any,
        node: block
      };
    })
    .toArray();
}

export function getOutlineTagsFromEditorValue(value: Value): string[] {
  const allTags = value.document
    .getInlines()
    .filter(inline => inline.type === "tag")
    .map(inline => inline.data.get("tag"))
    .toArray();
  return [...new Set(allTags)];
}

export function extractWord(word: string) {
  return word.substring(1);
}
