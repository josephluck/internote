import React, { useCallback, useRef } from "react";
import zenscroll from "zenscroll";
import { MarkType, BlockType, BlockName } from "../utilities/serializer";
import {
  Editor as SlateEditor,
  RenderBlockProps,
  RenderMarkProps
} from "slate-react";
import { SchemaProperties, Block } from "slate";
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
  getChanges,
  isListNavigationShortcut,
  isSpaceHotKey,
  isBackspaceHotKey,
  handleMarkdownFormatShortcut,
  handleMarkdownBackspaceShortcut
} from "../utilities/editor";
import { Wrap, EditorStyles, EditorInnerWrap } from "./editor-styles";
import { Option, Some, None } from "space-lift";
import { getFirstWordFromString } from "../utilities/string";
import { Outline } from "./outline";
import { Emoji } from "../utilities/emojis";
import { Tag } from "./tag";
import { useDebounce, useThrottle } from "../utilities/hooks";
import { Toolbar } from "./toolbar";
import { useTwineState, useTwineActions } from "../store";
import dynamic from "next/dynamic";
import {
  InternoteSlateEditorPropsWithRef,
  InternoteSlateEditorProps
} from "./slate";

const DynamicEditor = dynamic<InternoteSlateEditorPropsWithRef>(
  import("./slate").then(mod => mod.Editor),
  {
    ssr: false
  }
) as any;

const Editor = React.forwardRef<unknown, InternoteSlateEditorProps>(
  (props, ref) => <DynamicEditor {...props} forwardedRef={ref} />
);

const Ide = dynamic(import("./ide").then(module => module.Ide), { ssr: false });

const DEFAULT_NODE = "paragraph";

const schema: SchemaProperties = {
  inlines: {
    emoji: {
      isVoid: true,
      data: {
        code: code => !!code && code.length > 0
      }
    },
    tag: {
      isVoid: true,
      data: {
        tag: tag => !!tag && tag.length > 0
      }
    }
  },
  blocks: {
    ide: {
      isVoid: true,
      data: {
        content: _content => true
      }
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
  const overwriteCount = useTwineState(state => state.notes.overwriteCount);
  const outlineShowing = useTwineState(
    state => state.preferences.outlineShowing
  );
  const isDictionaryLoading = useTwineState(
    state => state.dictionary.loading.lookup
  );
  const isDictionaryShowing = useTwineState(
    state => state.dictionary.dictionaryShowing
  );
  const distractionFree = useTwineState(
    state => state.preferences.distractionFree
  );

  const {
    onChange,
    onRequestDictionary,
    onCloseDictionary,
    onRequestSpeech
  } = useTwineActions(
    actions => ({
      onChange: (value: OnChange) =>
        actions.notes.updateNote({ ...value, noteId: id }),
      onRequestDictionary: actions.dictionary.lookup,
      onCloseDictionary: () => actions.dictionary.setDictionaryShowing(false),
      onRequestSpeech: (words: string) =>
        actions.speech.requestSpeech({ words, id }),
      onCreateNewTag: (value: OnChange) =>
        actions.tags.saveNewTag({ ...value, noteId: id })
    }),
    [id]
  );

  /**
   * State
   */
  const [value, setValue] = React.useState(() =>
    getValueOrDefault(initialValue)
  );
  // TODO: hack as per https://github.com/ianstormtaylor/slate/issues/2927
  const valueRef = useRef(value);
  valueRef.current = value;
  const debouncedValue = useDebounce(value, 1000);
  const throttledValue = useThrottle(value, 100);
  const [userScrolled, setUserScrolled] = React.useState(false);

  /**
   * Derived state
   */
  const selectedText = getSelectedText(value);
  const shortcutSearch = getCurrentFocusedWord(value).filter(isShortcut);
  // TODO: hack as per https://github.com/ianstormtaylor/slate/issues/2927
  const shortcutSearchRef = useRef(shortcutSearch);
  shortcutSearchRef.current = shortcutSearch;

  /**
   * Refs
   */
  const editor = React.useRef<SlateEditor>();
  const scrollWrap = React.useRef<HTMLDivElement>();
  const scrollRef = React.useRef<ReturnType<typeof zenscroll.createScroller>>();
  const preventScrollListener = React.useRef<boolean>(false);
  const focusedNodeKey = React.useRef<any>();
  const isMouseDown = React.useRef(false);

  /**
   * Replace value state in response to props
   */
  React.useEffect(() => {
    setValue(getValueOrDefault(initialValue));
  }, [id, overwriteCount]);

  /**
   * Emit changes to parent when value changes
   */
  React.useEffect(() => {
    onChange(getChanges(debouncedValue));
  }, [debouncedValue.document]);

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

  /**
   * Setup block / mark keyboard shortcuts.
   *
   * NB: block shortcuts rely on value & editor ref
   * and mark shortcuts only rely on editor ref.
   */
  React.useEffect(() => {
    const onWindowKeyDown = (event: Event) => {
      getToolbarShortcutHandlerFromKeyEvent(event).map(handler => {
        handler(event);
      });
    };
    window.addEventListener("keydown", onWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, [editor.current, value]);

  /**
   * Editor keydown behavior:
   *
   * When user is searching (for tags and emojis), prevent
   * the usual keypress from affecting the editor.
   *
   * When the user is on their last list item and presses enter,
   * reset the current formatting to a paragraph.
   *
   * When the user is in a block and presses enter without typing
   * anything, reset the current formatting to a paragraph.
   */
  const onEditorKeyDown = useCallback((event: KeyboardEvent, _editor, next) => {
    // Prevent cursor navigation when inside a list (like tags, emojis)
    if (
      isListNavigationShortcut(event) &&
      shortcutSearchRef.current.isDefined()
    ) {
      event.preventDefault();
      return;
    }

    // Handle markdown shortcuts for lists and headings
    if (isSpaceHotKey(event)) {
      handleMarkdownFormatShortcut(
        event,
        editor.current,
        valueRef.current,
        next
      );
    }

    // Handle markdown backspace resetting
    // TODO: not sure if strictly necessary
    if (isBackspaceHotKey(event)) {
      handleMarkdownBackspaceShortcut(
        event,
        editor.current,
        valueRef.current,
        next
      );
    }

    // Handle enter key
    const isEnterKey = isEnterHotKey(event) && !event.shiftKey;
    if (isEnterKey) {
      const previousBlockType = valueRef.current.focusBlock.type;
      const isListItem = previousBlockType === "list-item";
      if (!isListItem) {
        // NB: Allow enter key to progress to add new paragraph
        // it's important that next() is called before
        // resetBlocks() as otherwise the previous formatting
        // will be removed (next places the cursor on the next line)
        next();
        resetBlocks();
        return;
      }
      const lastBlockEmpty = valueRef.current.startText.text.length === 0;
      const nextBlockIsListItem =
        !!valueRef.current.nextBlock &&
        valueRef.current.nextBlock.type === "list-item";
      const shouldCloseList = lastBlockEmpty && !nextBlockIsListItem;
      if (shouldCloseList) {
        resetBlocks();
        return;
      }
    }
    next();
  }, []); // TODO: this relies on resetBlocks but https://github.com/ianstormtaylor/slate/issues/2927 prevents it from being cache-busted

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

  const focusBlock = useCallback(
    (node: Block, end: boolean = false) => {
      editor.current.moveToRangeOfNode(node);
      if (end) {
        editor.current.moveStartToEndOfBlock();
        editor.current.moveFocusToEndOfNode(node);
      } else {
        editor.current.moveFocusToStartOfNode(node);
      }
      editor.current.focus();
    },
    [editor.current]
  );

  const focusPreviousBlock = useCallback(
    (_: Block) => {
      // TODO: would be good to preserve cursor column too
      const previousBlock = valueRef.current.previousBlock;
      focusBlock(previousBlock, true);
    },
    [editor.current]
  );

  const focusNextBlock = useCallback(
    (_: Block) => {
      // TODO: would be good to preserve cursor column too
      const nextBlock = valueRef.current.nextBlock;
      focusBlock(nextBlock);
    },
    [editor.current]
  );

  const addNewBlockAndFocus = useCallback(
    (_currentBlock: Block) => {
      editor.current.insertBlock("paragraph");
      focusNextBlock(_currentBlock);
    },
    [editor.current]
  );

  const destroyCurrentBlock = useCallback(
    (_currentBlock: Block) => {
      editor.current.deleteCharBackward();
      editor.current.focus();
    },
    [editor.current]
  );

  /**
   * Mouse down - should prevent focus mode scroll so that user
   * can drag to select text without the scroll going whacky.
   */
  React.useEffect(() => {
    const onMouseDown = () => (isMouseDown.current = true);
    const onMouseUp = () => (isMouseDown.current = false);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return function() {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  /**
   * Scrolling
   */
  const handleEditorScroll = useCallback(() => {
    if (!preventScrollListener.current) {
      setUserScrolled(true);
    }
  }, [preventScrollListener.current]);

  /**
   * Handle scroll refs and focus mode handling
   */
  React.useEffect(() => {
    if (scrollWrap.current) {
      scrollRef.current = zenscroll.createScroller(scrollWrap.current, 200);
      scrollWrap.current.addEventListener("scroll", handleEditorScroll);
      scrollWrap.current.addEventListener("click", handleFocusModeScroll);
    }
    return function() {
      scrollWrap.current.removeEventListener("scroll", handleEditorScroll);
      scrollWrap.current.removeEventListener("click", handleFocusModeScroll);
    };
  }, [scrollWrap.current, preventScrollListener.current, handleEditorScroll]);

  const handleFocusModeScroll = useCallback(() => {
    const focusedBlock = document.querySelector(".node-focused");
    if (
      !hasSelection(throttledValue) &&
      !isMouseDown.current &&
      focusedBlock &&
      scrollWrap.current &&
      scrollRef.current
    ) {
      preventScrollListener.current = true;
      scrollEditorToElement(focusedBlock as HTMLElement);
    }
  }, [throttledValue, scrollWrap.current, scrollRef.current]);

  const scrollEditorToElement = useCallback(
    (element: HTMLElement) => {
      scrollRef.current.center(element, 100, 0, () => {
        preventScrollListener.current = false;
        requestAnimationFrame(() => {
          setUserScrolled(false);
        });
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

  const onClickBlock = useCallback(
    (type: BlockType) => (event: Event) => {
      event.preventDefault();
      // Handle everything but list buttons.
      const isList = currentFocusHasBlock("list-item", value);
      if (type !== "bulleted-list" && type !== "numbered-list") {
        const hasBeenMadeActive = currentFocusHasBlock(type, value);
        if (isList) {
          resetBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
        } else {
          editor.current.setBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
        }
      } else {
        // Handle the extra wrapping required for list buttons.
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
    },
    [editor.current, value, resetBlocks]
  );

  /**
   * Speech
   */
  const requestSpeech = useCallback(() => {
    selectedText.map(onRequestSpeech);
  }, [selectedText, onRequestSpeech]);

  /**
   * Dictionary
   */
  const requestDictionary = useCallback(() => {
    selectedText.flatMap(getFirstWordFromString).map(onRequestDictionary);
  }, [selectedText, onRequestDictionary]);
  const onToggleDictionary = useCallback(() => {
    if (isDictionaryShowing) {
      onCloseDictionary();
    } else {
      requestDictionary();
    }
  }, [isDictionaryShowing, onCloseDictionary, requestDictionary]);

  /**
   * Emojis
   */
  const insertEmoji = useCallback(
    (emoji: Emoji, searchText: string) => {
      editor.current.deleteBackward(searchText.length);
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
    (tag: string, searchText: string) => {
      editor.current.deleteBackward(searchText.length);
      editor.current.insertInline({ type: "tag", data: { tag } });
      editor.current.focus();
      editor.current.moveToStartOfNextText();
    },
    [shortcutSearch, editor.current]
  );

  const createNewTag = useCallback(
    (tagName: string) => {
      insertTag(tagName, tagName);
    },
    [insertTag]
  );

  /**
   * Rendering
   */
  const renderBlock = (props: RenderBlockProps) => {
    const fadeClassName = props.isSelected ? "node-focused" : "node-unfocused";
    const preventForBlocks: BlockName[] = [
      "list-item",
      "bulleted-list",
      "numbered-list"
    ];
    const shouldFocusNode =
      !hasSelection(value) &&
      !preventForBlocks.includes(props.node.type as BlockName) &&
      props.isSelected &&
      props.key !== focusedNodeKey.current;
    if (shouldFocusNode) {
      focusedNodeKey.current = props.key;
      handleFocusModeScroll();
    }
    switch (props.node.type as BlockName) {
      case "paragraph":
        return (
          <p {...props.attributes} className={fadeClassName}>
            {props.children}
          </p>
        );
      case "block-quote":
        return (
          <blockquote {...props.attributes} className={fadeClassName}>
            {props.children}
          </blockquote>
        );
      case "bulleted-list":
        return <ul {...props.attributes}>{props.children}</ul>;
      case "numbered-list":
        return <ol {...props.attributes}>{props.children}</ol>;
      case "heading-one":
        return (
          <h1 {...props.attributes} className={fadeClassName}>
            {props.children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...props.attributes} className={fadeClassName}>
            {props.children}
          </h2>
        );
      case "list-item":
        return (
          <li {...props.attributes} className={fadeClassName}>
            {props.children}
          </li>
        );
      case "ide":
        return (
          <Ide
            {...props}
            onFocusPrevious={focusPreviousBlock}
            onFocusNext={focusNextBlock}
            onBreakToNewLine={addNewBlockAndFocus}
            onDestroy={destroyCurrentBlock}
            className={fadeClassName}
            onClick={focusBlock}
          />
        );
    }
  };

  const renderMark = (
    props: RenderMarkProps,
    _editor: any,
    next: () => any
  ) => {
    switch (props.mark.type as MarkType) {
      case "bold":
        return <strong {...props.attributes}>{props.children}</strong>;
      case "code":
        return <code {...props.attributes}>{props.children}</code>;
      case "italic":
        return <em {...props.attributes}>{props.children}</em>;
      case "underlined":
        return <u {...props.attributes}>{props.children}</u>;
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
            onHeadingClick={focusBlock}
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
