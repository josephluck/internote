import React from "react";
import zenscroll from "zenscroll";
import { MarkType, BlockType, BlockName } from "../utilities/serializer";
import { Editor as SlateEditor } from "slate-react";
import { Saving } from "./saving";
import { Flex } from "@rebass/grid";
import { SchemaProperties } from "slate";
import { faUndo, faRedo } from "@fortawesome/free-solid-svg-icons";
import { Speech } from "./speech";
import { ToolbarButton, ButtonSpacer } from "./toolbar-button";
import { Collapse } from "react-collapse";
import * as Types from "@internote/api/domains/types";
import { Dictionary } from "./dictionary";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { DictionaryButton } from "./dictionary-button";
import { DeleteNoteButton } from "./delete-note-button";
import { UndoRedoButton } from "./undo-redo-button";
import {
  ToolbarWrapper,
  ToolbarInner,
  ToolbarExpandedWrapper,
  ToolbarExpandedInner,
  renderToolbarIcon
} from "./toolbar";
import {
  getValueOrDefault,
  getTitleFromEditorValue,
  isBoldHotkey,
  isItalicHotkey,
  isUnderlinedHotkey,
  isCodeHotkey,
  isH1Hotkey,
  isH2Hotkey,
  isQuoteHotkey,
  isOlHotkey,
  isUlHotkey,
  isCtrlHotKey,
  isEnterHotKey,
  hasSelection,
  getSelectedContent,
  currentFocusIsWithinList,
  currentFocusHasBlock,
  currentFocusHasMark,
  getCurrentFocusedWord,
  isEmojiShortcut,
  shouldPreventEventForMenuNavigationShortcut,
  isShortcut,
  isTagShortcut,
  getTagsFromEditorValue,
  extractWord
} from "../utilities/editor";
import { Wrap, EditorStyles, Editor, EditorInnerWrap } from "./editor-styles";
import { Option, Some, None } from "space-lift";
import { getFirstWordFromString } from "../utilities/string";
import { Outline } from "./outline";
import { EmojiToggle } from "./emoji-toggle";
import { EmojiList } from "./emoji-list";
import { Emoji } from "../utilities/emojis";
import { TagsList } from "./tags-list";
import { Tag } from "./tag";
import { useDebounce, useThrottle } from "../utilities/hooks";

const DEFAULT_NODE = "paragraph";

interface OnChange {
  content: Object;
  title: string;
  tags: string[];
}

const schema: SchemaProperties = {
  inlines: {
    emoji: {
      isVoid: true
    },
    tag: {
      isVoid: true
    }
  }
};

export function InternoteEditor({
  id,
  overwriteCount,
  initialValue,
  onChange,
  onSaveTag,
  onDelete,
  saving,
  distractionFree,
  speechSrc,
  isSpeechLoading,
  isDictionaryLoading,
  isDictionaryShowing,
  onRequestSpeech,
  onDiscardSpeech,
  onCloseDictionary,
  onRequestDictionary,
  dictionaryResults,
  outlineShowing,
  tags,
  newTagSaving
}: {
  id: string;
  overwriteCount: number;
  initialValue: {};
  onChange: (value: OnChange) => Promise<void>;
  onSaveTag: (value: OnChange) => Promise<void>;
  onDelete: () => void;
  saving: boolean;
  distractionFree: boolean;
  speechSrc: string;
  isSpeechLoading: boolean;
  isDictionaryLoading: boolean;
  isDictionaryShowing: boolean;
  onRequestSpeech: (content: string) => any;
  onDiscardSpeech: () => any;
  onCloseDictionary: () => any;
  onRequestDictionary: (word: string) => any;
  dictionaryResults: Types.DictionaryResult[];
  outlineShowing: boolean;
  tags: Types.Tag[];
  newTagSaving: boolean;
}) {
  /**
   * State
   */
  const [value, setValue] = React.useState(() =>
    getValueOrDefault(initialValue)
  );
  const [userScrolled, setUserScrolled] = React.useState(false);
  const [isCtrlHeld, setIsCtrlHeld] = React.useState(false);
  const [isEmojiMenuShowing, setIsEmojiMenuShowing] = React.useState(false);
  const [forceShowEmojiMenu, setForceShowEmojiMenu] = React.useState(false);
  const [isTagsMenuShowing, setIsTagsMenuShowing] = React.useState(false);
  const [shortcutSearch, setShortcutSearch] = React.useState("");
  const [dictionaryRequestedWord, setDictionaryRequestedWord] = React.useState(
    ""
  );

  /**
   * Derived state
   */
  const debouncedValue = useDebounce(value, 1000);
  const throttledValue = useThrottle(value, 100);
  const emojiMenuShowing = isEmojiMenuShowing || forceShowEmojiMenu;
  const toolbarIsExpanded =
    emojiMenuShowing ||
    isTagsMenuShowing ||
    isDictionaryShowing ||
    newTagSaving;
  const isToolbarShowing =
    hasSelection(value) || !!speechSrc || isCtrlHeld || toolbarIsExpanded;

  /**
   * Refs
   */
  const editor = React.useRef<SlateEditor>();
  const scrollWrap = React.useRef<HTMLDivElement>();
  const scroller = React.useRef<ReturnType<typeof zenscroll.createScroller>>();
  const preventScrollListener = React.useRef<boolean>(false);
  const focusedNodeKey = React.useRef<any>();

  /**
   * Handle scroll refs and focus mode handling
   */
  React.useEffect(() => {
    if (scrollWrap.current) {
      scroller.current = zenscroll.createScroller(scrollWrap.current, 200);
      scrollWrap.current.addEventListener("scroll", handleEditorScroll);
      scrollWrap.current.addEventListener("click", handleFocusModeScroll);
    }
  }, [scrollWrap.current]);

  /**
   * Reload value when id or overwrite changes
   */
  React.useEffect(() => {
    setValue(getValueOrDefault(initialValue));
    refocusEditor();
  }, [id, overwriteCount]);

  /**
   * Setup window events
   */
  React.useEffect(() => {
    window.addEventListener("keyup", onKeyUp);
    return function() {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  /**
   * Emit changes to parent when value changes
   * (debounced)
   */
  React.useEffect(() => {
    emitChange();
  }, [debouncedValue]);

  /**
   * Focus block when value changes
   */
  React.useEffect(() => {
    handleFocusModeScroll();
  }, [throttledValue]);

  /**
   * Change handling
   */
  function getChanges(): OnChange {
    return {
      content: value.toJSON(),
      title: getTitleFromEditorValue(value),
      tags: getTagsFromEditorValue(value)
    };
  }
  function change(newValue: any) {
    handleShortcutSearch();
    if (value !== newValue) {
      setValue(newValue);
    }
  }
  function emitChange() {
    onChange(getChanges());
  }

  /**
   * Keyboard event handling
   */
  function getEventHandlerFromKeyEvent(
    event: Event
  ): Option<(event: Event) => void> {
    if (isBoldHotkey(event)) {
      return Some(onClickMark("bold"));
    } else if (isItalicHotkey(event)) {
      return Some(onClickMark("italic"));
    } else if (isUnderlinedHotkey(event)) {
      return Some(onClickMark("underlined"));
    } else if (isCodeHotkey(event)) {
      return Some(onClickMark("code"));
    } else if (isH1Hotkey(event)) {
      return Some(onClickBlock("heading-one"));
    } else if (isH2Hotkey(event)) {
      return Some(onClickBlock("heading-two"));
    } else if (isQuoteHotkey(event)) {
      return Some(onClickBlock("block-quote"));
    } else if (isOlHotkey(event)) {
      return Some(onClickBlock("numbered-list"));
    } else if (isUlHotkey(event)) {
      return Some(onClickBlock("bulleted-list"));
    } else {
      return None;
    }
  }
  function onKeyDown(event, editor, next) {
    const menuShowing = isEmojiMenuShowing || isTagsMenuShowing;
    if (
      shouldPreventEventForMenuNavigationShortcut(
        event,
        shortcutSearch,
        menuShowing
      )
    ) {
      event.preventDefault();
      return;
    }
    handleResetBlockOnEnterPressed(event, editor, next);
    if (isCtrlHotKey(event)) {
      setIsCtrlHeld(true);
    }
    getEventHandlerFromKeyEvent(event).map(handler => {
      event.preventDefault();
      handler(event);
    });
  }
  function onKeyUp(event: KeyboardEvent) {
    if (isCtrlHotKey(event)) {
      setIsCtrlHeld(false);
    }
  }
  function handleResetBlockOnEnterPressed(event: KeyboardEvent, editor, next) {
    const isEnterKey = isEnterHotKey(event) && !event.shiftKey;
    if (isEnterKey) {
      const previousBlockType = editor.value.focusBlock.type;
      const isListItem = previousBlockType === "list-item";
      if (!isListItem) {
        // NB: Allow enter key to progress to add new paragraph
        // it's important that next() is called before
        // resetBlocks() as otherwise the previous formatting
        // will be removed
        next();
        resetBlocks();
        return;
      }
      const lastBlockEmpty = editor.value.startText.text.length === 0;
      const nextBlockIsListItem =
        !!editor.value.nextBlock && editor.value.nextBlock.type === "list-item";
      const shouldCloseList = lastBlockEmpty && !nextBlockIsListItem;
      if (shouldCloseList) {
        resetBlocks();
        return;
      }
    }
    next();
  }
  function handleShortcutSearch() {
    const shortcut = getCurrentFocusedWord(value).filter(isShortcut);
    // Handle emojis
    shortcut
      .filter(isEmojiShortcut)
      .map(extractWord)
      .fold(
        () => {
          if (isEmojiMenuShowing) {
            setEmojiMenuShowing(false);
          }
        },
        shortcutSearch => {
          setShortcutSearch(shortcutSearch);
          setEmojiMenuShowing(true);
        }
      );
    // Handle tags
    shortcut
      .filter(isTagShortcut)
      .map(extractWord)
      .fold(
        () => setTagsMenuShowing(false),
        shortcutSearch => {
          setShortcutSearch(shortcutSearch);
          setTagsMenuShowing(true);
        }
      );
  }

  /**
   * Editor methods
   */
  function resetBlocks(node: string = DEFAULT_NODE) {
    editor.current
      .setBlocks(node)
      .unwrapBlock("bulleted-list")
      .unwrapBlock("numbered-list");
  }
  function undo() {
    editor.current.undo();
  }
  function redo() {
    editor.current.redo();
  }
  function refocusEditor() {
    editor.current.focus();
  }
  function focusNode(node: Node) {
    editor.current.moveToRangeOfNode(node);
    editor.current.moveFocusToStartOfNode(node);
    editor.current.focus();
  }

  /**
   * Scrolling
   */
  function handleEditorScroll() {
    // TODO: this is screwing it up
    if (scrollWrap && !userScrolled && !preventScrollListener.current) {
      // setUserScrolled(true);
    }
  }
  function handleFocusModeScroll() {
    const focusedBlock = document.querySelector(".node-focused");
    const editorScrollWrap = scrollWrap;
    if (!hasSelection(value) && focusedBlock && editorScrollWrap && scroller) {
      preventScrollListener.current = true;
      scrollEditorToElement(focusedBlock as HTMLElement);
      setUserScrolled(false);
    }
  }
  function scrollEditorToElement(element: HTMLElement) {
    scroller.current.center(element, 100, 0, () => {
      // requestAnimationFrame
      preventScrollListener.current = false;
    });
  }

  /**
   * Mark and block handling
   */
  function onClickMark(type: MarkType) {
    return function(event: Event) {
      event.preventDefault();
      editor.current.toggleMark(type);
    };
  }
  function onClickBlock(type: BlockType) {
    return function(event: Event) {
      event.preventDefault();
      // Handle everything but list buttons.
      if (type !== "bulleted-list" && type !== "numbered-list") {
        const hasBeenMadeActive = currentFocusHasBlock(type, value);
        const isList = currentFocusHasBlock("list-item", value);
        if (isList) {
          resetBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
        } else {
          editor.current.setBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
        }
      } else {
        // Handle the extra wrapping required for list buttons.
        const isList = currentFocusHasBlock("list-item", value);
        const isType = value.blocks.some(
          block =>
            !!value.document.getClosest(
              block.key,
              (parent: any) => parent.type === type
            )
        );
        if (isList && isType) {
          resetBlocks();
        } else if (isList) {
          editor.current
            .unwrapBlock(
              type === "bulleted-list" ? "numbered-list" : "bulleted-list"
            )
            .wrapBlock(type);
        } else {
          editor.current.setBlocks("list-item").wrapBlock(type);
        }
      }
    };
  }

  /**
   * Speech
   */
  function requestSpeech() {
    getSelectedContent(value).map(onRequestSpeech);
  }

  /**
   * Dictionary
   */
  function requestDictionary() {
    getSelectedContent(value)
      .flatMap(getFirstWordFromString)
      .map(word => {
        onRequestDictionary(word);
        setDictionaryRequestedWord(word);
      });
  }
  function onToggleDictionary() {
    if (isDictionaryShowing) {
      closeDictionary();
    } else {
      requestDictionary();
    }
  }
  function closeDictionary() {
    onCloseDictionary();
    setDictionaryRequestedWord("");
  }

  /**
   * Emojis
   */
  function setEmojiMenuShowing(showing: boolean, force?: boolean) {
    setIsEmojiMenuShowing(showing);
    setForceShowEmojiMenu(
      typeof force !== "undefined" ? force : forceShowEmojiMenu
    );
    if (!showing) {
      refocusEditor();
    }
  }
  function insertEmoji(emoji: Emoji) {
    refocusEditor();
    if (shortcutSearch.length > 0) {
      editor.current.deleteBackward(shortcutSearch.length + 1); // NB: +1 required to compensate for colon
    }
    editor.current.insertInline({ type: "emoji", data: { code: emoji.char } });
    // requestAnimationFrame
    setIsEmojiMenuShowing(false);
    editor.current.moveToStartOfNextText();
    refocusEditor();
  }

  /**
   * Tags
   */
  function setTagsMenuShowing(showing: boolean) {
    setIsTagsMenuShowing(showing);
    if (!showing) {
      refocusEditor();
    }
  }
  function insertTag(tag: string, shouldCloseTagsMenu: boolean = true) {
    refocusEditor();
    if (shortcutSearch.length > 0) {
      editor.current.deleteBackward(shortcutSearch.length + 1); // NB: +1 required to compensate for hash
    }
    editor.current.insertInline({ type: "tag", data: { tag } });
    if (shouldCloseTagsMenu) {
      closeTagsMenu();
    }
    editor.current.moveToStartOfNextText();
    refocusEditor();
  }
  function closeTagsMenu() {
    // requestAnimationFrame
    setIsTagsMenuShowing(false);
  }
  async function saveTag(tag: string) {
    // requestAnimationFrame
    insertTag(tag, false);
    // end
    await onSaveTag(getChanges());
    closeTagsMenu();
  }

  /**
   * Toolbar
   */
  function closeExpandedToolbar() {
    setEmojiMenuShowing(false, false);
    setTagsMenuShowing(false);
    closeDictionary();
  }

  /**
   * Rendering
   */
  function renderMarkButton(type: MarkType, shortcutNumber: number) {
    // TODO: onClick type
    return (
      <ToolbarButton
        onClick={onClickMark(type) as any}
        isActive={currentFocusHasMark(type, value)}
        shortcutNumber={shortcutNumber}
        shortcutShowing={isCtrlHeld}
      >
        {renderToolbarIcon(type)}
      </ToolbarButton>
    );
  }
  function renderBlockButton(type: BlockType, shortcutNumber: number) {
    const isActive =
      currentFocusHasBlock(type, value) ||
      currentFocusIsWithinList(type, value);
    return (
      <ToolbarButton
        onClick={onClickBlock(type) as any}
        isActive={isActive}
        shortcutNumber={shortcutNumber}
        shortcutShowing={isCtrlHeld}
      >
        {renderToolbarIcon(type)}
      </ToolbarButton>
    );
  }
  function renderBlock({ attributes, children, node, isSelected, key }) {
    const fadeClassName = isSelected ? "node-focused" : "node-unfocused";
    const preventForBlocks: (BlockType | BlockName)[] = [
      "list-item",
      "bulleted-list",
      "numbered-list"
    ];
    const shouldFocusNode =
      !hasSelection(value) &&
      !preventForBlocks.includes(node.type) &&
      isSelected &&
      key !== focusedNodeKey.current;
    if (shouldFocusNode) {
      focusedNodeKey.current = key;
      // requestAnimationFrame
      handleFocusModeScroll();
    }
    switch ((node as any).type) {
      case "paragraph":
        return (
          <p {...attributes} className={fadeClassName}>
            {children}
          </p>
        );
      case "block-quote":
        return (
          <blockquote {...attributes} className={fadeClassName}>
            {children}
          </blockquote>
        );
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "heading-one":
        return (
          <h1 {...attributes} className={fadeClassName}>
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...attributes} className={fadeClassName}>
            {children}
          </h2>
        );
      case "list-item":
        return (
          <li {...attributes} className={fadeClassName}>
            {children}
          </li>
        );
    }
  }
  function renderMark(props, next) {
    const { children, mark, attributes } = props;
    switch (mark.type as MarkType) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  }
  function renderInline(props, _editor, next) {
    const { attributes, node } = props;
    switch (node.type) {
      case "emoji":
        return (
          <span
            {...attributes}
            contentEditable={false}
            onDrop={e => e.preventDefault()}
          >
            {node.data.get("code")}
          </span>
        );
      case "tag":
        return (
          <Tag
            {...attributes}
            isFocused
            large
            contentEditable={false}
            onDrop={e => e.preventDefault()}
          >
            {node.data.get("tag")}
          </Tag>
        );
      default:
        return next();
    }
  }

  return (
    <Wrap>
      <EditorStyles ref={scrollWrap}>
        <EditorInnerWrap
          distractionFree={distractionFree}
          userScrolled={userScrolled}
        >
          <Editor
            placeholder=""
            ref={editor}
            value={value as any}
            onChange={c => change(c.value)}
            onKeyDown={onKeyDown}
            renderBlock={renderBlock}
            renderMark={renderMark}
            renderInline={renderInline}
            autoFocus
            schema={schema}
            distractionFree={distractionFree}
          />

          <Outline
            value={value}
            onHeadingClick={focusNode}
            showing={outlineShowing}
          />
        </EditorInnerWrap>
      </EditorStyles>

      <ToolbarWrapper
        distractionFree={distractionFree}
        forceShow={isToolbarShowing}
      >
        <ToolbarInner>
          <Flex flex={1}>
            {renderBlockButton("heading-one", 1)}
            {renderBlockButton("heading-two", 2)}
            {renderBlockButton("numbered-list", 3)}
            {renderBlockButton("bulleted-list", 4)}
            {renderMarkButton("code", 5)}
            {renderBlockButton("block-quote", 6)}
            {renderMarkButton("bold", 7)}
            {renderMarkButton("italic", 8)}
            {renderMarkButton("underlined", 9)}
            <ButtonSpacer small>
              <EmojiToggle
                isActive={emojiMenuShowing}
                onClick={() =>
                  setEmojiMenuShowing(!isEmojiMenuShowing, !isEmojiMenuShowing)
                }
              />
            </ButtonSpacer>
            <ButtonSpacer small>
              <UndoRedoButton onClick={undo} icon={faUndo} tooltip="Undo" />
            </ButtonSpacer>
            <ButtonSpacer small>
              <UndoRedoButton onClick={redo} icon={faRedo} tooltip="Redo" />
            </ButtonSpacer>
          </Flex>
          <Flex alignItems="center">
            <ButtonSpacer small>
              <DictionaryButton
                isLoading={isDictionaryLoading}
                isShowing={isDictionaryShowing}
                onClick={onToggleDictionary}
              />
            </ButtonSpacer>
            <ButtonSpacer small>
              <Speech
                onRequest={requestSpeech}
                src={speechSrc}
                isLoading={isSpeechLoading}
                onDiscard={onDiscardSpeech}
                onFinished={onDiscardSpeech}
              />
            </ButtonSpacer>
            <ButtonSpacer>
              <DeleteNoteButton onClick={onDelete} />
            </ButtonSpacer>
            <Saving saving={saving} />
          </Flex>
        </ToolbarInner>
        {toolbarIsExpanded ? (
          <OnKeyboardShortcut keyCombo="esc" cb={closeExpandedToolbar} />
        ) : null}
        <OnKeyboardShortcut keyCombo="mod+d" cb={requestDictionary} />
        <Collapse isOpened={toolbarIsExpanded} style={{ width: "100%" }}>
          <ToolbarExpandedWrapper>
            <ToolbarExpandedInner>
              <ToolbarInner>
                {isTagsMenuShowing || newTagSaving ? (
                  <TagsList
                    onTagSelected={insertTag}
                    onSaveTag={saveTag}
                    tags={tags.map(t => t.tag)}
                    search={shortcutSearch}
                    newTagSaving={newTagSaving}
                  />
                ) : isEmojiMenuShowing ? (
                  <EmojiList
                    onEmojiSelected={insertEmoji}
                    search={shortcutSearch}
                  />
                ) : isDictionaryShowing ? (
                  <Dictionary
                    isLoading={isDictionaryLoading}
                    results={dictionaryResults}
                    requestedWord={dictionaryRequestedWord}
                  />
                ) : null}
              </ToolbarInner>
            </ToolbarExpandedInner>
          </ToolbarExpandedWrapper>
        </Collapse>
      </ToolbarWrapper>
    </Wrap>
  );
}
