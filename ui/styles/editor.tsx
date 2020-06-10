import {
  SchemaBlockType,
  SchemaMarkType,
} from "@internote/export-service/types";
import { GetSnippetDTO } from "@internote/snippets-service/types";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  createEditor,
  Editor,
  Node,
  SchemaProperties,
  Transforms,
} from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { None, Option, Some } from "space-lift";
import styled, { keyframes } from "styled-components";
import { Block } from "typescript";
import zenscroll from "zenscroll";
import { useTwineActions, useTwineState } from "../store";
import {
  currentFocusHasBlock,
  getChanges,
  getCurrentFocusedWord,
  getSelectedText,
  getValueOrDefault,
  handleMarkdownBackspaceShortcut,
  handleMarkdownFormatShortcut,
  hasSelection,
  isBackspaceHotKey,
  isBoldHotkey,
  isCodeHotkey,
  isEnterHotKey,
  isH1Hotkey,
  isH2Hotkey,
  isItalicHotkey,
  isListNavigationShortcut,
  isOlHotkey,
  isQuoteHotkey,
  isShortcut,
  isSpaceHotKey,
  isUlHotkey,
  isUnderlinedHotkey,
  OnChange,
} from "../utilities/editor";
import { Emoji } from "../utilities/emojis";
import { useDebounce, useThrottle } from "../utilities/hooks";
import { getFirstWordFromString } from "../utilities/string";
import { isServer } from "../utilities/window";
import { CreateSnippetModal } from "./create-snippet-modal";
import { EditorInnerWrap, EditorStyles, Wrap } from "./editor-styles";
import { InternoteUploadEvent } from "./file-upload";
import { MediaEmbed } from "./media-embed";
import { Outline } from "./outline";
import { SnippetsContext } from "./snippets-context";
import { Tag } from "./tag";
import { Toolbar } from "./toolbar";

type SlateEditor = Editor & ReactEditor;

export function InternoteEditor({
  id,
  initialValue,
}: {
  id: string;
  initialValue: {};
}) {
  const editor: SlateEditor = useMemo(() => withReact(createEditor()), []);

  const outlineShowing = useTwineState(
    (state) => state.preferences.outlineShowing
  );

  const isDictionaryShowing = useTwineState(
    (state) => state.dictionary.dictionaryShowing
  );

  const distractionFree = useTwineState(
    (state) => state.preferences.distractionFree
  );

  const {
    onChange,
    onRequestDictionary,
    onRequestSpeech,
    createSnippet,
  } = useTwineActions(
    (actions) => ({
      onChange: (value: OnChange) =>
        actions.notes.updateNote({ ...value, noteId: id }),
      onRequestDictionary: actions.dictionary.lookup,
      onRequestSpeech: (words: string) =>
        actions.speech.requestSpeech({ words, id }),
      onCreateNewTag: (value: OnChange) =>
        actions.tags.saveNewTag({ ...value, noteId: id }),
      createSnippet: actions.snippets.createSnippet,
    }),
    [id]
  );

  /**
   * State
   */
  const [value, setValue] = React.useState<Node[]>(() =>
    getValueOrDefault(initialValue)
  );
  const valueRef = useRef(value);
  valueRef.current = value;
  const debouncedValue = useDebounce(value, 1000);
  const throttledValue = useThrottle(value, 100);
  const [userScrolled, setUserScrolled] = React.useState(false);
  const { snippetsMenuShowing, snippetToInsert } = React.useContext(
    SnippetsContext
  );

  /**
   * Derived state
   */
  const selectedText = getSelectedText(value);
  const shortcutSearch = getCurrentFocusedWord(value).filter(isShortcut);
  const shortcutSearchRef = useRef(shortcutSearch);
  shortcutSearchRef.current = shortcutSearch;

  /**
   * Refs
   */
  const scrollWrap = React.useRef<HTMLDivElement>();
  const scrollRef = React.useRef<ReturnType<typeof zenscroll.createScroller>>();
  const preventScrollListener = React.useRef<boolean>(false);
  const focusedNodeKey = React.useRef<any>();
  const isMouseDown = React.useRef(false);
  const snippetInsertionIndicatorRef = React.useRef<HTMLDivElement>();

  /**
   * Replace value state in response to props
   */
  React.useEffect(() => {
    setValue(getValueOrDefault(initialValue));
  }, [id]);

  /**
   * Emit changes to parent when value changes
   */
  const isFirst = React.useRef(true);
  React.useEffect(() => {
    // NB: skip onChange on first render
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
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
    } else if (isH1Hotkey(event as KeyboardEvent)) {
      return Some(onClickBlock("heading-one"));
    } else if (isH2Hotkey(event as KeyboardEvent)) {
      return Some(onClickBlock("heading-two"));
    } else if (isQuoteHotkey(event)) {
      return Some(onClickBlock("block-quote"));
    } else if (isOlHotkey(event as KeyboardEvent)) {
      return Some(onClickBlock("numbered-list"));
    } else if (isUlHotkey(event as KeyboardEvent)) {
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
      getToolbarShortcutHandlerFromKeyEvent(event).map((handler) => {
        handler(event);
      });
    };
    window.addEventListener("keydown", onWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, [editor, value]);

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
      handleMarkdownFormatShortcut(event, editor, valueRef.current, next);
    }

    if (isBackspaceHotKey(event)) {
      handleMarkdownBackspaceShortcut(event, editor, valueRef.current, next);
    }

    // Handle enter key
    const isEnterKey = isEnterHotKey(event) && !event.shiftKey;
    if (isEnterKey) {
      const previousSchemaBlockType = valueRef.current.focusBlock.type;
      const isListItem = previousSchemaBlockType === "list-item";
      if (!isListItem) {
        /**
         * NB: Allow enter key to progress to add new paragraph
         * it's important that next() is called before
         * resetBlocks() as otherwise the previous formatting
         * will be removed (next places the cursor on the next line)
         */
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
  }, []);

  /**
   * Editor methods
   */
  const resetBlocks = useCallback(
    (node: string = DEFAULT_NODE) => {
      editor
        .setBlocks(node)
        .unwrapBlock("bulleted-list")
        .unwrapBlock("numbered-list");
    },
    [editor]
  );

  const focusBlock = useCallback(
    (node: Block, end: boolean = false) => {
      editor.moveToRangeOfNode(node as any);
      if (end) {
        editor.moveStartToEndOfBlock();
        editor.moveFocusToEndOfNode(node as any);
      } else {
        editor.moveFocusToStartOfNode(node as any);
      }
      editor.focus();
    },
    [editor]
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
    return () => {
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
  }, []);

  /**
   * Handle scroll refs and focus mode handling
   */
  React.useEffect(() => {
    if (scrollWrap.current) {
      scrollRef.current = zenscroll.createScroller(scrollWrap.current, 200);
      scrollWrap.current.addEventListener("scroll", handleEditorScroll);
      scrollWrap.current.addEventListener("click", handleFocusModeScroll);
    }
    return function () {
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
    (type: SchemaMarkType) => (event: Event) => {
      event.preventDefault();
      editor.toggleMark(type);
    },
    [editor]
  );

  const onClickBlock = useCallback(
    (type: SchemaBlockType) => (event: Event) => {
      event.preventDefault();
      // Handle everything but list buttons.
      const isList = currentFocusHasBlock("list-item", value);
      if (type !== "bulleted-list" && type !== "numbered-list") {
        const hasBeenMadeActive = currentFocusHasBlock(type, value);
        if (isList) {
          resetBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
        } else {
          editor.setBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
        }
      } else {
        // Handle the extra wrapping required for list buttons.
        const isType = value.blocks.some(
          (block) =>
            !!value.document.getClosest(
              block.key,
              (parent: any) => parent.type === type
            )
        );
        if (isList && isType) {
          resetBlocks();
        } else if (isList) {
          editor
            .unwrapBlock(
              type === "bulleted-list" ? "numbered-list" : "bulleted-list"
            )
            .wrapBlock(type);
        } else {
          editor.setBlocks("list-item").wrapBlock(type);
        }
      }
    },
    [editor, value, resetBlocks]
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

  /**
   * Emojis
   */
  const insertEmoji = useCallback(
    (emoji: Emoji, searchText: string) => {
      editor.deleteBackward(searchText.length);
      editor.insertInline({
        type: "emoji",
        data: { code: emoji.char },
      });
      editor.focus();
      editor.moveToStartOfNextText();
    },
    [shortcutSearch, editor]
  );

  /**
   * Tags
   */
  const insertTag = useCallback(
    (tag: string, searchText: string) => {
      editor.deleteBackward(searchText.length);
      editor.insertInline({ type: "tag", data: { tag } });
      editor.focus();
      editor.moveToStartOfNextText();
    },
    [shortcutSearch, editor]
  );

  const createNewTag = useCallback(
    (tagName: string) => {
      insertTag(tagName, tagName);
    },
    [insertTag]
  );

  const insertSnippet = useCallback(
    (snippet: GetSnippetDTO) => {
      const doc = Document.fromJSON(snippet.content);
      editor.focus();
      // NB: wait for focus to happen
      requestAnimationFrame(() => {
        editor.insertFragment(doc as any);
      });
    },
    [editor]
  );

  /** Positions the snippet insertion indicator to where the user's cursor would be (and where the snippet would end up) */
  const updateSnippetInsertionIndicator = () => {
    const snippetInsertionIndicator = snippetInsertionIndicatorRef.current;
    const selection = valueRef.current.selection;
    if (
      isServer() ||
      !snippetInsertionIndicator ||
      !selection ||
      !snippetsMenuShowing ||
      !snippetToInsert
    ) {
      if (!isServer()) {
        snippetInsertionIndicator.removeAttribute("style");
      }
      return;
    }

    /** NB: important to focus the editor so that the window.getSelection() works */
    editor.focus();

    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    snippetInsertionIndicator.style.opacity = "1";
    snippetInsertionIndicator.style.top = `${
      rect.top + window.pageYOffset - snippetInsertionIndicator.offsetHeight
    }px`;
    snippetInsertionIndicator.style.left = `${
      rect.left +
      window.pageXOffset -
      snippetInsertionIndicator.offsetWidth / 2 +
      rect.width / 2
    }px`;
  };

  const onFileUploadStarted = useCallback(
    (e: InternoteUploadEvent) => {
      editor.insertBlock({
        type: e.type, // NB: Generic media type. See schema for more information
        data: { src: e.src, key: e.key, name: e.name, uploaded: e.uploaded },
      });
      editor.focus();
      editor.moveToStartOfNextText();
    },
    [editor]
  );

  useEffect(() => {
    updateSnippetInsertionIndicator();
  }, [value, snippetsMenuShowing, snippetToInsert]);

  const handleCreateSnippet = useCallback((title: string) => {
    const fragment = valueRef.current.fragment.toJSON();
    createSnippet({
      title,
      content: fragment as any,
    });
  }, []);

  const renderInline = (props, _editor, next) => {
    const { attributes, node } = props;
    switch (node.type) {
      case "emoji":
        return (
          <span
            {...attributes}
            contentEditable={false}
            onDrop={(e) => e.preventDefault()}
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
            onDrop={(e) => e.preventDefault()}
          >
            {node.data.get("tag")}
          </Tag>
        );
      default:
        return next();
    }
  };

  const renderElement = useCallback(
    (props: RenderElementProps) => <EditorElement {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <EditorLeaf {...props} />,
    []
  );

  return (
    <Wrap>
      <EditorStyles ref={scrollWrap}>
        <EditorInnerWrap
          distractionFree={distractionFree}
          userScrolled={userScrolled}
        >
          <Slate editor={editor} value={value} onChange={setValue}>
            <Editable renderElement={renderElement} renderLeaf={renderLeaf} />

            <Toolbar
              createNewTag={createNewTag}
              distractionFree={distractionFree}
              id={id}
              insertEmoji={insertEmoji}
              insertTag={insertTag}
              isDictionaryShowing={isDictionaryShowing}
              onClickBlock={onClickBlock}
              onClickMark={onClickMark}
              requestDictionary={requestDictionary}
              requestSpeech={requestSpeech}
              selectedText={selectedText}
              shortcutSearch={shortcutSearch}
              value={value}
              onSnippetSelected={insertSnippet}
              onFileUploadStarted={onFileUploadStarted}
            />

            <SnippetInsertionIndicator ref={snippetInsertionIndicatorRef}>
              👇
            </SnippetInsertionIndicator>
            <Outline
              value={value}
              onHeadingClick={focusBlock}
              showing={outlineShowing}
            />
            <CreateSnippetModal onCreateSnippet={handleCreateSnippet} />
          </Slate>
          {/* <Editor
            placeholder=""
            ref={editor}
            value={value as any}
            onChange={(c) => setValue(c.value)}
            onKeyDown={onEditorKeyDown}
            renderBlock={renderBlock}
            renderMark={renderMark}
            renderInline={renderInline}
            autoFocus
            schema={schema as any}
            distractionFree={distractionFree}
          /> */}
        </EditorInnerWrap>
      </EditorStyles>
    </Wrap>
  );
}

const toggleBlock = (editor: SlateEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: SlateEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: SlateEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (nodes) => nodes.type === format,
  });

  return !!match;
};

const isMarkActive = (editor: SlateEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks && Boolean(marks[format]);
};

const EditorElement: React.FunctionComponent<RenderElementProps> = ({
  element,
  ...props
}) => {
  console.log({ props });

  const fadeClassName = props.isSelected ? "node-focused" : "node-unfocused";
  // const preventForBlocks: SchemaBlockType[] = [
  //   "list-item",
  //   "bulleted-list",
  //   "numbered-list",
  // ];
  // const shouldFocusNode =
  //   !hasSelection(value) &&
  //   !preventForBlocks.includes(props.node.type as SchemaBlockType) &&
  //   props.isSelected &&
  //   props.key !== focusedNodeKey.current;
  // if (shouldFocusNode) {
  //   focusedNodeKey.current = props.key;
  //   handleFocusModeScroll();
  // }

  switch (element.type) {
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
    case "image":
    case "video":
    case "audio":
    case "unknown-file":
      return <MediaEmbed {...props} />;
    default:
      return (
        <p {...props.attributes} className={fadeClassName}>
          {props.children}
        </p>
      );
  }
};

const EditorLeaf: React.FunctionComponent<RenderLeafProps> = ({
  leaf,
  children,
  attributes,
}) => {
  if (leaf.bold) {
    return <strong {...attributes}>{children}</strong>;
  }
  if (leaf.code) {
    return <code {...attributes}>{children}</code>;
  }
  if (leaf.italic) {
    return <em {...attributes}>{children}</em>;
  }
  if (leaf.underlined) {
    return <u {...attributes}>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const DEFAULT_NODE = "paragraph";

const bouncy = keyframes`
  from {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-5px);
  }

  to {
    transform: translateY(0px);
  }
`;

const SnippetInsertionIndicator = styled.div`
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  opacity: 0;
  transition: opacity 0.75s;
  animation: ${bouncy} 1s ease-in-out infinite;
`;

const mediaSchema = {
  isVoid: true,
  data: {
    src: (_src) => true,
    key: (_key) => true,
    name: (_name) => true,
    uploaded: (_uploaded) => true,
  },
};

const schema: SchemaProperties = {
  inlines: {
    emoji: {
      isVoid: true,
      data: {
        code: (code) => !!code && code.length > 0,
      },
    },
    tag: {
      isVoid: true,
      data: {
        tag: (tag) => !!tag && tag.length > 0,
      },
    },
  },
  blocks: {
    image: mediaSchema,
    video: mediaSchema,
    audio: mediaSchema,
    "unknown-file": mediaSchema,
  },
};
