import { Value } from "slate";
import isKeyHotkey from "is-hotkey";
import { defaultNote } from "@internote/api/domains/note/default-note";
import { Option, Some, None } from "space-lift";
import { BlockType } from "./serializer";

export function getTitleFromEditorValue(
  editorValue: Value
): string | undefined {
  if (
    editorValue.document &&
    editorValue.document.getBlocks &&
    editorValue.document.getBlocks()
  ) {
    const block = editorValue.document
      .getBlocks()
      .find(block => block.text != "");
    return block ? block.text : undefined;
  } else {
    return undefined;
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
