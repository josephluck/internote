import React from "react";
import ReactDOM from "react-dom";
import zenscroll from "zenscroll";
import { MarkType, BlockType, BlockName } from "../utilities/serializer";
import { Plugin, Editor as SlateEditor } from "slate-react";
import { throttle } from "lodash";
import { debounce } from "lodash";
import { Saving } from "./saving";
import { Flex } from "@rebass/grid";
import { Value } from "slate";
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
  currentFocusHasMark
} from "../utilities/editor";
import {
  Wrap,
  EditorStyles,
  Editor,
  EditorInnerWrap,
  TextEditorWrap
} from "./editor-styles";
import { Option, Some, None } from "space-lift";
import { getFirstWordFromString } from "../utilities/string";
import { Outline } from "./outline";
import { OutlineButton } from "./outline-button";

const DEFAULT_NODE = "paragraph";

interface Props {
  id: string;
  initialValue: {};
  debounceValue?: number;
  onChange: (value: { content: Object; title: string }) => void;
  onDelete: () => void;
  saving: boolean;
  distractionFree: boolean;
  speechSrc: string;
  isSpeechLoading: boolean;
  isDictionaryLoading: boolean;
  isDictionaryShowing: boolean;
  onRequestSpeech: (content: string) => any;
  onDiscardSpeech: () => any;
  closeDictionary: () => any;
  onRequestDictionary: (word: string) => any;
  dictionaryResults: Types.DictionaryResult[];
  outlineShowing: boolean;
  toggleOutlineShowing: (outlineShowing: boolean) => any;
}

interface State {
  value: Value;
  userScrolled: boolean;
  isCtrlHeld: boolean;
}

export class InternoteEditor extends React.Component<Props, State> {
  debounceValue = 3000;
  preventScrollListener = false;
  scroller: ReturnType<typeof zenscroll.createScroller> | null = null;
  focusedNodeKey: string = "";
  editor: SlateEditor | null = null;
  scrollWrap: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.debounceValue = props.debounceValue || 3000;
    this.state = {
      value: getValueOrDefault(props.initialValue),
      userScrolled: false,
      isCtrlHeld: false
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        value: getValueOrDefault(this.props.initialValue)
      });
    }
  }

  componentDidMount() {
    window.addEventListener("keyup", this.onKeyUp);
  }

  storeEditorRef = (editor: SlateEditor) => {
    this.editor = editor;
  };

  storeScrollWrapRef = (scrollWrap: HTMLDivElement) => {
    this.scrollWrap = scrollWrap;
    this.scroller = zenscroll.createScroller(scrollWrap, 200);
    scrollWrap.addEventListener("scroll", this.handleEditorScroll);
    scrollWrap.addEventListener("click", this.handleFocusModeScroll);
  };

  // TODO: value type should be Value
  onChange = (value: any) => {
    if (this.state.value !== value) {
      this.setState({ value }, this.emitChange);
      window.requestAnimationFrame(this.handleFocusModeScroll);
    }
  };

  emitChange = debounce(() => {
    this.props.onChange({
      content: this.state.value.toJSON(),
      title: getTitleFromEditorValue(this.state.value)
    });
  }, this.debounceValue);

  getEventHandlerFromKeyEvent = (
    event: Event
  ): Option<(event: Event) => void> => {
    if (isBoldHotkey(event)) {
      return Some(this.onClickMark("bold"));
    } else if (isItalicHotkey(event)) {
      return Some(this.onClickMark("italic"));
    } else if (isUnderlinedHotkey(event)) {
      return Some(this.onClickMark("underlined"));
    } else if (isCodeHotkey(event)) {
      return Some(this.onClickMark("code"));
    } else if (isH1Hotkey(event)) {
      return Some(this.onClickBlock("heading-one"));
    } else if (isH2Hotkey(event)) {
      return Some(this.onClickBlock("heading-two"));
    } else if (isQuoteHotkey(event)) {
      return Some(this.onClickBlock("block-quote"));
    } else if (isOlHotkey(event)) {
      return Some(this.onClickBlock("numbered-list"));
    } else if (isUlHotkey(event)) {
      return Some(this.onClickBlock("bulleted-list"));
    } else {
      return None;
    }
  };

  onKeyDown: Plugin["onKeyDown"] = (event, change, next) => {
    this.handleResetBlockOnEnterPressed(event, change, next);

    if (isCtrlHotKey(event)) {
      this.setState({ isCtrlHeld: true });
    }

    this.getEventHandlerFromKeyEvent(event).map(handler => {
      event.preventDefault();
      handler(event);
    });
  };

  onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 17) {
      this.setState({ isCtrlHeld: false });
    }
  };

  handleResetBlockOnEnterPressed: Plugin["onKeyDown"] = (
    event: KeyboardEvent,
    change,
    next
  ) => {
    const isEnterKey = isEnterHotKey(event) && !event.shiftKey;
    if (isEnterKey) {
      const previousBlockType = change.value.focusBlock.type;
      const isListItem = previousBlockType === "list-item";
      if (!isListItem) {
        // NB: Allow enter key to progress to add new paragraph
        // it's important that next() is called before
        // this.resetBlocks() as otherwise the previous formatting
        // will be removed
        next();
        this.resetBlocks();
        return;
      }
      const lastBlockEmpty = change.value.startText.text.length === 0;
      const nextBlockIsListItem =
        !!change.value.nextBlock && change.value.nextBlock.type === "list-item";
      const shouldCloseList = lastBlockEmpty && !nextBlockIsListItem;
      if (shouldCloseList) {
        this.resetBlocks();
        return;
      }
    }
    next();
  };

  resetBlocks = (node: string = DEFAULT_NODE) => {
    this.editor
      .setBlocks(node)
      .unwrapBlock("bulleted-list")
      .unwrapBlock("numbered-list");
  };

  handleEditorScroll = throttle(
    () => {
      if (
        this.scrollWrap &&
        !this.state.userScrolled &&
        !this.preventScrollListener
      ) {
        this.setState({ userScrolled: true });
      }
    },
    500,
    { leading: true, trailing: false }
  );

  handleFocusModeScroll = throttle(
    () => {
      if (this.props.distractionFree) {
        const focusedBlock = document.querySelector(".node-focused");
        const editorScrollWrap = this.scrollWrap;
        if (focusedBlock && editorScrollWrap && this.scroller) {
          this.preventScrollListener = true;
          this.setState({ userScrolled: false }, () =>
            this.scrollEditorToElement(focusedBlock as HTMLElement)
          );
        }
      }
    },
    500,
    { leading: true }
  );

  scrollEditorToElement = (element: HTMLElement) => {
    this.scroller.center(element, 200, 0, () => {
      window.requestAnimationFrame(() => {
        this.preventScrollListener = false;
      });
    });
  };

  onClickMark = (type: MarkType) => (event: Event) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  onClickBlock = (type: BlockType) => (event: Event) => {
    event.preventDefault();

    const { editor } = this;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const hasBeenMadeActive = currentFocusHasBlock(type, this.state.value);
      const isList = currentFocusHasBlock("list-item", this.state.value);

      if (isList) {
        this.resetBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
      } else {
        editor.setBlocks(hasBeenMadeActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = currentFocusHasBlock("list-item", this.state.value);
      const isType = editor.value.blocks.some(
        block =>
          !!editor.value.document.getClosest(
            block.key,
            (parent: any) => parent.type === type
          )
      );

      if (isList && isType) {
        this.resetBlocks();
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
  };

  onRequestSpeech = () => {
    getSelectedContent(this.state.value).map(this.props.onRequestSpeech);
  };

  onRequestDictionary = () => {
    getSelectedContent(this.state.value)
      .flatMap(getFirstWordFromString)
      .map(this.props.onRequestDictionary);
  };

  onToggleDictionary = () => {
    if (this.props.isDictionaryShowing) {
      this.props.closeDictionary();
    } else {
      this.onRequestDictionary();
    }
  };

  renderMarkButton = (type: MarkType, shortcutNumber: number) => {
    // TODO: onClick type
    return (
      <ToolbarButton
        onClick={this.onClickMark(type) as any}
        isActive={currentFocusHasMark(type, this.state.value)}
        shortcutNumber={shortcutNumber}
        shortcutShowing={this.state.isCtrlHeld}
      >
        {renderToolbarIcon(type)}
      </ToolbarButton>
    );
  };

  renderBlockButton = (type: BlockType, shortcutNumber: number) => {
    const isActive =
      currentFocusHasBlock(type, this.state.value) ||
      currentFocusIsWithinList(type, this.state.value);

    // TODO: onClick type
    return (
      <ToolbarButton
        onClick={this.onClickBlock(type) as any}
        isActive={isActive}
        shortcutNumber={shortcutNumber}
        shortcutShowing={this.state.isCtrlHeld}
      >
        {renderToolbarIcon(type)}
      </ToolbarButton>
    );
  };

  // TODO: update this when types support
  renderBlock: any = ({ attributes, children, node, isSelected, key }) => {
    const fadeClassName = isSelected ? "node-focused" : "node-unfocused";
    const preventForBlocks: (BlockType | BlockName)[] = [
      "list-item",
      "bulleted-list",
      "numbered-list"
    ];
    const shouldFocusNode =
      !hasSelection(this.state.value) &&
      !preventForBlocks.includes(node.type) &&
      isSelected &&
      key !== this.focusedNodeKey;

    if (shouldFocusNode) {
      this.focusedNodeKey = key;
      window.requestAnimationFrame(this.handleFocusModeScroll);
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

  renderMark: Plugin["renderMark"] = (props, next) => {
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

  undo = () => {
    this.editor.undo();
  };

  redo = () => {
    this.editor.redo();
  };

  focusNode = (node: Node) => {
    this.editor.moveToRangeOfNode(node);
    this.editor.moveFocusToStartOfNode(node);
    this.editor.focus();
  };

  render() {
    const isToolbarShowing =
      hasSelection(this.state.value) ||
      !!this.props.speechSrc ||
      this.state.isCtrlHeld ||
      this.props.isDictionaryShowing;

    return (
      <Wrap>
        <EditorStyles
          distractionFree={this.props.distractionFree}
          userScrolled={this.state.userScrolled}
        >
          <EditorInnerWrap
            ref={elm => {
              const node = ReactDOM.findDOMNode(elm);
              if (node) {
                this.storeScrollWrapRef(node as HTMLDivElement);
              }
            }}
          >
            <TextEditorWrap>
              <Editor
                placeholder=""
                ref={this.storeEditorRef}
                value={this.state.value as any}
                onChange={change => this.onChange(change.value)}
                onKeyDown={this.onKeyDown}
                renderBlock={this.renderBlock}
                renderMark={this.renderMark}
                autoFocus
                distractionFree={this.props.distractionFree}
              />
            </TextEditorWrap>

            <Outline
              value={this.state.value}
              onItemClick={this.focusNode}
              showing={this.props.outlineShowing}
            />
          </EditorInnerWrap>
        </EditorStyles>

        <ToolbarWrapper
          distractionFree={this.props.distractionFree}
          forceShow={isToolbarShowing}
        >
          <ToolbarInner>
            <Flex flex={1}>
              {this.renderBlockButton("heading-one", 1)}
              {this.renderBlockButton("heading-two", 2)}
              {this.renderBlockButton("numbered-list", 3)}
              {this.renderBlockButton("bulleted-list", 4)}
              {this.renderMarkButton("code", 5)}
              {this.renderBlockButton("block-quote", 6)}
              {this.renderMarkButton("bold", 7)}
              {this.renderMarkButton("italic", 8)}
              {this.renderMarkButton("underlined", 9)}
              <ButtonSpacer small>
                <UndoRedoButton
                  onClick={this.undo}
                  icon={faUndo}
                  tooltip="Undo"
                />
              </ButtonSpacer>
              <ButtonSpacer small>
                <UndoRedoButton
                  onClick={this.redo}
                  icon={faRedo}
                  tooltip="Redo"
                />
              </ButtonSpacer>
            </Flex>
            <Flex alignItems="center">
              <ButtonSpacer small>
                <OutlineButton
                  isActive={this.props.outlineShowing}
                  onClick={() =>
                    this.props.toggleOutlineShowing(!this.props.outlineShowing)
                  }
                />
              </ButtonSpacer>
              <ButtonSpacer small>
                <DictionaryButton
                  isLoading={this.props.isDictionaryLoading}
                  isShowing={this.props.isDictionaryShowing}
                  onClick={this.onToggleDictionary}
                />
              </ButtonSpacer>
              <ButtonSpacer small>
                <Speech
                  onRequest={this.onRequestSpeech}
                  src={this.props.speechSrc}
                  isLoading={this.props.isSpeechLoading}
                  onDiscard={this.props.onDiscardSpeech}
                  onFinished={this.props.onDiscardSpeech}
                />
              </ButtonSpacer>
              <ButtonSpacer>
                <DeleteNoteButton onClick={this.props.onDelete} />
              </ButtonSpacer>
              <Saving saving={this.props.saving} />
            </Flex>
          </ToolbarInner>
          <Collapse
            isOpened={this.props.isDictionaryShowing}
            style={{ width: "100%" }}
          >
            <ToolbarExpandedWrapper>
              <ToolbarExpandedInner>
                <ToolbarInner>
                  <Dictionary
                    isLoading={this.props.isDictionaryLoading}
                    results={this.props.dictionaryResults}
                  />
                  {this.props.isDictionaryShowing ? (
                    <OnKeyboardShortcut
                      keyCombo="esc"
                      cb={this.onToggleDictionary}
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
}
