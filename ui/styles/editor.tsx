import React, { useCallback } from "react";
import zenscroll from "zenscroll";
import { MarkType, BlockType, BlockName } from "../utilities/serializer";
import { Editor as SlateEditor } from "slate-react";
import { SchemaProperties } from "slate";
import {
  getValueOrDefault,
  isBoldHotkey,
  isItalicHotkey,
  isUnderlinedHotkey,
  isCodeHotkey,
  isH1Hotkey,
  isH2Hotkey,
  isQuoteHotkey,
  isOlHotkey,
  isUlHotkey,
  isEnterHotKey,
  hasSelection,
  getSelectedText,
  currentFocusHasBlock,
  getCurrentFocusedWord,
  isShortcut,
  OnChange,
  getChanges
} from "../utilities/editor";
import { Wrap, EditorStyles, Editor, EditorInnerWrap } from "./editor-styles";
import { Option, Some, None } from "space-lift";
import { getFirstWordFromString, getLength } from "../utilities/string";
import { Outline } from "./outline";
import { Emoji } from "../utilities/emojis";
import { Tag } from "./tag";
import { useDebounce, useThrottle } from "../utilities/hooks";
import { Toolbar } from "./toolbar";
import { useTwine } from "../store";

const DEFAULT_NODE = "paragraph";

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
  initialValue
}: {
  id: string;
  initialValue: {};
}) {
  const [
    {
      overwriteCount,
      outlineShowing,
      isDictionaryLoading,
      isDictionaryShowing,
      distractionFree
    },
    { onChange, onRequestDictionary, onCloseDictionary, onRequestSpeech }
  ] = useTwine(
    state => ({
      overwriteCount: state.notes.overwriteCount,
      outlineShowing: state.preferences.outlineShowing,
      isDictionaryLoading: state.dictionary.loading.requestDictionary,
      isDictionaryShowing: state.dictionary.dictionaryShowing,
      distractionFree: state.preferences.distractionFree
    }),
    actions => ({
      onChange: (value: OnChange) =>
        actions.notes.updateNote({ noteId: id, ...value }),
      onRequestDictionary: actions.dictionary.requestDictionary,
      onCloseDictionary: () => actions.dictionary.setDictionaryShowing(false),
      onRequestSpeech: (content: string) =>
        actions.speech.requestSpeech({ content, noteId: id }),
      onCreateNewTag: (value: OnChange) =>
        actions.tags.saveNewTag({ ...value, noteId: id })
    })
  );

  /**
   * State
   */
  const [value, setValue] = React.useState(() =>
    getValueOrDefault(initialValue)
  );
  const debouncedValue = useDebounce(value, 1000);
  const throttledValue = useThrottle(value, 100);
  const [userScrolled, setUserScrolled] = React.useState(false);

  /**
   * Derived state
   */
  const selectedText = getSelectedText(value);
  const shortcutSearch = getCurrentFocusedWord(value).filter(isShortcut);

  /**
   * Refs
   */
  const editor = React.useRef<SlateEditor>();
  const scrollWrap = React.useRef<HTMLDivElement>();
  const scrollRef = React.useRef<ReturnType<typeof zenscroll.createScroller>>();
  const preventScrollListener = React.useRef<boolean>(false);
  const focusedNodeKey = React.useRef<any>();

  /**
   * Handle scroll refs and focus mode handling
   */
  React.useEffect(() => {
    if (scrollWrap.current) {
      scrollRef.current = zenscroll.createScroller(scrollWrap.current, 200);
      scrollWrap.current.addEventListener("scroll", handleEditorScroll);
      scrollWrap.current.addEventListener("click", handleFocusModeScroll);
    }
  }, [scrollWrap.current]);

  /**
   * Replace value state in response to props
   */
  React.useEffect(() => {
    setValue(getValueOrDefault(initialValue));
  }, [id, overwriteCount]);

  /**
   * Setup window event listeners
   */
  React.useEffect(() => {
    window.addEventListener("keydown", onWindowKeyDown);
    return function() {
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, []);

  /**
   * Emit changes to parent when value changes
   */
  React.useEffect(() => {
    onChange(getChanges(debouncedValue));
  }, [debouncedValue]);

  /**
   * Focus block when value changes
   */
  React.useEffect(() => {
    handleFocusModeScroll();
  }, [throttledValue]);

  /**
   * Keyboard event handling
   */
  const getToolbarShortcutHandlerFromKeyEvent = (
    event: Event
  ): Option<(event: Event) => void> => {
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
  };
  const onWindowKeyDown = useCallback((event: Event) => {
    getToolbarShortcutHandlerFromKeyEvent(event).map(handler => {
      handler(event);
    });
  }, []);
  const onEditorKeyDown = (event: KeyboardEvent, editor, next) => {
    // TODO: state is old? Maybe needs to be memo or triggered by an effect somehow

    // TODO: fix this
    // const menuShowing = isEmojiShortcut || isTagsShortcut;
    // if (isListShortcut(event) && shortcutSearch.isDefined()) {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   return;
    // }
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
  };

  /**
   * Editor methods
   */
  const resetBlocks = useCallback(
    (node: string = DEFAULT_NODE) => {
      editor.current
        .setBlocks(node)
        .unwrapBlock("bulleted-list")
        .unwrapBlock("numbered-list");
    },
    [editor.current]
  );
  const focusNode = useCallback(
    (node: Node) => {
      editor.current.moveToRangeOfNode(node);
      editor.current.moveFocusToStartOfNode(node);
      editor.current.focus();
    },
    [editor.current]
  );

  /**
   * Scrolling
   */
  const handleEditorScroll = () => {
    // TODO: this is screwing focus mode
    if (scrollWrap && !userScrolled && !preventScrollListener.current) {
      // setUserScrolled(true);
    }
  };
  const handleFocusModeScroll = useCallback(() => {
    const focusedBlock = document.querySelector(".node-focused");
    if (
      !hasSelection(debouncedValue) &&
      focusedBlock &&
      scrollWrap.current &&
      scrollRef.current
    ) {
      preventScrollListener.current = true;
      scrollEditorToElement(focusedBlock as HTMLElement);
      setUserScrolled(false);
    }
  }, [debouncedValue, scrollRef.current]);
  const scrollEditorToElement = useCallback(
    (element: HTMLElement) => {
      scrollRef.current.center(element, 100, 0, () => {
        preventScrollListener.current = false;
      });
    },
    [scrollRef.current]
  );

  /**
   * Mark and block handling
   */
  const onClickMark = useCallback(
    (type: MarkType) => (event: Event) => {
      event.preventDefault();
      editor.current.toggleMark(type);
    },
    [editor.current]
  );
  const onClickBlock = (type: BlockType) => (event: Event) => {
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

  /**
   * Speech
   */
  const requestSpeech = useCallback(() => {
    getSelectedText(value).map(onRequestSpeech);
  }, [value]);

  /**
   * Dictionary
   */
  const requestDictionary = useCallback(() => {
    selectedText.flatMap(getFirstWordFromString).map(onRequestDictionary);
  }, [selectedText]);
  const onToggleDictionary = useCallback(() => {
    if (isDictionaryShowing) {
      onCloseDictionary();
    } else {
      requestDictionary();
    }
  }, [isDictionaryLoading, onCloseDictionary, requestDictionary]);

  /**
   * Emojis
   */
  const insertEmoji = useCallback(
    (emoji: Emoji) => {
      shortcutSearch.map(getLength).map(editor.current.deleteBackward);
      editor.current.insertInline({
        type: "emoji",
        data: { code: emoji.char }
      });
      editor.current.focus();
      editor.current.moveToStartOfNextText();
    },
    [shortcutSearch, editor.current]
  );

  /**
   * Tags
   */
  const insertTag = useCallback(
    (tag: string) => {
      shortcutSearch.map(getLength).map(editor.current.deleteBackward);
      editor.current.insertInline({ type: "tag", data: { tag } });
      editor.current.focus();
      editor.current.moveToStartOfNextText();
    },
    [shortcutSearch, editor.current]
  );
  const createNewTag = useCallback(() => {
    shortcutSearch.map(insertTag);
  }, [shortcutSearch]);

  /**
   * Rendering
   */
  const renderBlock = ({ attributes, children, node, isSelected, key }) => {
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
  };
  const renderMark = (props, next) => {
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
  };
  const renderInline = (props, _editor, next) => {
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
  };

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
            onChange={c => setValue(c.value)}
            onKeyDown={onEditorKeyDown}
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

      <Toolbar
        createNewTag={createNewTag}
        distractionFree={distractionFree}
        id={id}
        insertEmoji={insertEmoji}
        insertTag={insertTag}
        isDictionaryLoading={isDictionaryLoading}
        isDictionaryShowing={isDictionaryShowing}
        onClickBlock={onClickBlock}
        onClickMark={onClickMark}
        onToggleDictionary={onToggleDictionary}
        requestDictionary={requestDictionary}
        requestSpeech={requestSpeech}
        selectedText={selectedText}
        shortcutSearch={shortcutSearch}
        value={value}
      />
    </Wrap>
  );
}
