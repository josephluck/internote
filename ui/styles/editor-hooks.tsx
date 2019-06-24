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
  getSelectedText,
  currentFocusIsWithinList,
  currentFocusHasBlock,
  currentFocusHasMark,
  getCurrentFocusedWord,
  wordIsEmojiShortcut,
  isListShortcut,
  isShortcut,
  wordIsTagShortcut,
  OnChange,
  getChanges
} from "../utilities/editor";
import { Wrap, EditorStyles, Editor, EditorInnerWrap } from "./editor-styles";
import { Option, Some, None } from "space-lift";
import {
  getFirstWordFromString,
  removeFirstLetterFromString,
  getLength,
  stringIsOneWord
} from "../utilities/string";
import { Outline } from "./outline";
import { EmojiToggle } from "./emoji-toggle";
import { EmojiList } from "./emoji-list";
import { Emoji } from "../utilities/emojis";
import { TagsList } from "./tags-list";
import { Tag } from "./tag";
import { useDebounce, useThrottle } from "../utilities/hooks";
import { Shortcut } from "./shortcuts";
import { ShortcutsReference } from "./shortcuts-reference";

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
  overwriteCount,
  initialValue,
  saving,
  distractionFree,
  speechSrc,
  isSpeechLoading,
  isDictionaryLoading,
  isDictionaryShowing,
  dictionaryResults,
  outlineShowing,
  tags,
  newTagSaving,
  onRequestSpeech,
  onDiscardSpeech,
  onCloseDictionary,
  onRequestDictionary,
  onChange,
  // onCreateNewTag, // TODO: fix this
  onDelete
}: {
  id: string;
  overwriteCount: number;
  initialValue: {};
  saving: boolean;
  distractionFree: boolean;
  speechSrc: string;
  isSpeechLoading: boolean;
  isDictionaryLoading: boolean;
  isDictionaryShowing: boolean;
  dictionaryResults: Types.DictionaryResult[];
  outlineShowing: boolean;
  tags: Types.Tag[];
  newTagSaving: boolean;
  onChange: (value: OnChange) => Promise<void>;
  onCreateNewTag: (value: OnChange) => Promise<void>;
  onDelete: () => void;
  onRequestSpeech: (content: string) => any;
  onDiscardSpeech: () => any;
  onCloseDictionary: () => any;
  onRequestDictionary: (word: string) => any;
}) {
  /**
   * State
   */
  const [value, setValue] = React.useState(() =>
    getValueOrDefault(initialValue)
  );
  const debouncedValue = useDebounce(value, 1000);
  const throttledValue = useThrottle(value, 100);
  const [userScrolled, setUserScrolled] = React.useState(false);
  const [isCtrlHeld, setIsCtrlHeld] = React.useState(false);
  const [isEmojiButtonPressed, setIsEmojiButtonPressed] = React.useState(false);
  const [
    isShortcutsReferenceShowing,
    setIsShortcutsReferenceShowing
  ] = React.useState(true);

  /**
   * Derived state
   */
  const selectedText = getSelectedText(value);
  const shortcutSearch = getCurrentFocusedWord(value).filter(isShortcut);
  const isEmojiShortcut = shortcutSearch
    .filter(wordIsEmojiShortcut)
    .isDefined();
  const isTagsShortcut = shortcutSearch.filter(wordIsTagShortcut).isDefined();
  const toolbarIsExpanded =
    isEmojiShortcut ||
    isEmojiButtonPressed ||
    isTagsShortcut ||
    isDictionaryShowing ||
    newTagSaving ||
    isShortcutsReferenceShowing;
  const isToolbarShowing =
    hasSelection(value) || !!speechSrc || isCtrlHeld || toolbarIsExpanded;

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
    window.addEventListener("keyup", onWindowKeyUp);
    window.addEventListener("keydown", onWindowKeyDown);
    return function() {
      window.removeEventListener("keyup", onWindowKeyUp);
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
  const onWindowKeyDown = (event: Event) => {
    getToolbarShortcutHandlerFromKeyEvent(event).map(handler => {
      handler(event);
    });
    if (isCtrlHotKey(event)) {
      setIsCtrlHeld(true);
    }
  };
  const onWindowKeyUp = (event: KeyboardEvent) => {
    if (!isCtrlHotKey(event)) {
      setIsCtrlHeld(false);
    }
  };
  const onEditorKeyDown = (event: KeyboardEvent, editor, next) => {
    // TODO: state is old? Maybe needs to be memo or triggered by an effect somehow
    const menuShowing = isEmojiShortcut || isTagsShortcut;
    if (menuShowing && isListShortcut(event) && shortcutSearch.isDefined()) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
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
  const resetBlocks = (node: string = DEFAULT_NODE) => {
    editor.current
      .setBlocks(node)
      .unwrapBlock("bulleted-list")
      .unwrapBlock("numbered-list");
  };
  const focusNode = (node: Node) => {
    editor.current.moveToRangeOfNode(node);
    editor.current.moveFocusToStartOfNode(node);
    editor.current.focus();
  };

  /**
   * Scrolling
   */
  const handleEditorScroll = () => {
    // TODO: this is screwing focus mode
    if (scrollWrap && !userScrolled && !preventScrollListener.current) {
      // setUserScrolled(true);
    }
  };
  const handleFocusModeScroll = () => {
    const focusedBlock = document.querySelector(".node-focused");
    const editorScrollWrap = scrollWrap;
    if (!hasSelection(value) && focusedBlock && editorScrollWrap && scrollRef) {
      preventScrollListener.current = true;
      scrollEditorToElement(focusedBlock as HTMLElement);
      setUserScrolled(false);
    }
  };
  const scrollEditorToElement = (element: HTMLElement) => {
    scrollRef.current.center(element, 100, 0, () => {
      preventScrollListener.current = false;
    });
  };

  /**
   * Mark and block handling
   */
  const onClickMark = (type: MarkType) => {
    return function(event: Event) {
      event.preventDefault();
      editor.current.toggleMark(type);
    };
  };
  const onClickBlock = (type: BlockType) => {
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
  };

  /**
   * Speech
   */
  const requestSpeech = () => {
    getSelectedText(value).map(onRequestSpeech);
  };

  /**
   * Dictionary
   */
  const requestDictionary = () => {
    selectedText.flatMap(getFirstWordFromString).map(onRequestDictionary);
  };
  const onToggleDictionary = () => {
    if (isDictionaryShowing) {
      onCloseDictionary();
    } else {
      requestDictionary();
    }
  };

  /**
   * Emojis
   */
  const insertEmoji = (emoji: Emoji) => {
    shortcutSearch.map(getLength).map(editor.current.deleteBackward);
    editor.current.insertInline({ type: "emoji", data: { code: emoji.char } });
    editor.current.focus();
    editor.current.moveToStartOfNextText();
  };

  /**
   * Tags
   */
  const insertTag = (tag: string) => {
    shortcutSearch.map(getLength).map(editor.current.deleteBackward);
    editor.current.insertInline({ type: "tag", data: { tag } });
    editor.current.focus();
    editor.current.moveToStartOfNextText();
  };
  const createNewTag = () => {
    shortcutSearch.map(insertTag);
  };

  /**
   * Toolbar
   */
  const closeExpandedToolbar = () => {
    setIsEmojiButtonPressed(false);
    onCloseDictionary();
  };

  /**
   * Rendering
   */
  const renderMarkButton = (type: MarkType, shortcutNumber: number) => {
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
  };
  const renderBlockButton = (type: BlockType, shortcutNumber: number) => {
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
  };
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
      {isShortcutsReferenceShowing ? (
        <Shortcut
          id="hide-shortcuts-reference"
          description="Hide shortcuts reference"
          keyCombo={["esc", "mod+k"]}
          callback={() => setIsShortcutsReferenceShowing(false)}
        />
      ) : (
        <Shortcut
          id="show-shortcuts-reference"
          description="Show shortcuts reference"
          keyCombo="mod+k"
          callback={() => setIsShortcutsReferenceShowing(true)}
        />
      )}
      {toolbarIsExpanded ? (
        <Shortcut
          id="close-expanded-toolbar"
          description="Close the toolbar"
          keyCombo="esc"
          callback={closeExpandedToolbar}
        />
      ) : null}
      {editor.current &&
      editor.current.focus &&
      selectedText.filter(stringIsOneWord).isDefined() ? (
        <Shortcut
          id="request-dictionary"
          description={`Lookup "${selectedText.getOrElse("")}"`}
          keyCombo="mod+d"
          callback={requestDictionary}
        />
      ) : null}
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
                isActive={isEmojiShortcut || isEmojiButtonPressed}
                onClick={() => setIsEmojiButtonPressed(!isEmojiButtonPressed)}
              />
            </ButtonSpacer>
            <ButtonSpacer small>
              <UndoRedoButton
                onClick={editor.current && editor.current.undo}
                icon={faUndo}
                tooltip="Undo"
              />
            </ButtonSpacer>
            <ButtonSpacer small>
              <UndoRedoButton
                onClick={editor.current && editor.current.redo}
                icon={faRedo}
                tooltip="Redo"
              />
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
        <Collapse isOpened={toolbarIsExpanded} style={{ width: "100%" }}>
          <ToolbarExpandedWrapper>
            <ToolbarExpandedInner>
              <ToolbarInner>
                {isTagsShortcut || newTagSaving ? (
                  <TagsList
                    onTagSelected={insertTag}
                    onCreateNewTag={createNewTag}
                    tags={tags.map(t => t.tag)}
                    search={shortcutSearch
                      .flatMap(removeFirstLetterFromString)
                      .getOrElse("")}
                    newTagSaving={newTagSaving}
                  />
                ) : isEmojiButtonPressed || isEmojiShortcut ? (
                  <EmojiList
                    onEmojiSelected={insertEmoji}
                    search={shortcutSearch
                      .flatMap(removeFirstLetterFromString)
                      .getOrElse("")}
                  />
                ) : isDictionaryShowing ? (
                  <Dictionary
                    isLoading={isDictionaryLoading}
                    results={dictionaryResults}
                    requestedWord={selectedText
                      .flatMap(getFirstWordFromString)
                      .getOrElse("")}
                  />
                ) : isShortcutsReferenceShowing ? (
                  <ShortcutsReference />
                ) : null}
              </ToolbarInner>
            </ToolbarExpandedInner>
          </ToolbarExpandedWrapper>
        </Collapse>
      </ToolbarWrapper>
    </Wrap>
  );
}
