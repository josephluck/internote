import React from "react";
import zenscroll from "zenscroll";
import {
  serializer,
  MarkType,
  BlockType,
  BlockName
} from "../utilities/serializer";
import { Editor, Plugin } from "slate-react";
import { throttle } from "lodash";
import { debounce } from "lodash";
import isKeyHotkey from "is-hotkey";
import { spacing, font, borderRadius } from "../theming/symbols";
import { styled } from "../theming/styled";
import { Saving } from "./saving";
import { Flex } from "@rebass/grid";
import { Value } from "slate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faCode,
  faHeading,
  faQuoteLeft,
  faListUl,
  faListOl,
  faUndo,
  faRedo
} from "@fortawesome/free-solid-svg-icons";
import { Wrapper } from "./wrapper";
import { Speech } from "./speech";
import { ToolbarButton } from "./toolbar-button";
import { Collapse } from "react-collapse";
import * as Types from "@internote/api/domains/types";
import { Dictionary } from "./dictionary";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { DictionaryButton } from "./dictionary-button";
import { DeleteNoteButton } from "./delete-note-button";
import { UndoRedoButton } from "./undo-redo-button";

const DEFAULT_NODE = "paragraph";

const isH1Hotkey = isKeyHotkey("mod+1");
const isH2Hotkey = isKeyHotkey("mod+2");
const isOlHotkey = isKeyHotkey("mod+3");
const isUlHotkey = isKeyHotkey("mod+4");
const isCodeHotkey = isKeyHotkey("mod+5") || isKeyHotkey("mod+`");
const isQuoteHotkey = isKeyHotkey("mod+6") || isKeyHotkey("mod+'");
const isBoldHotkey = isKeyHotkey("mod+7") || isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+8") || isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+9") || isKeyHotkey("mod+u");
const isCtrlHotKey = isKeyHotkey("ctrl") || isKeyHotkey("mod");

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

const EditorStyles = styled.div<{
  distractionFree: boolean;
  userScrolled: boolean;
}>`
  display: flex;
  flex: 1;
  overflow: auto;
  font-family: ${props => props.theme.fontFamily};
  .slate-editor {
    padding-top: 50vh; // Ensure enough room to center first block
    padding-bottom: 50vh; // Ensure enough room to center last block
  }
  > div:first-of-type {
    min-height: 100vh;
  }
  strong {
    font-weight: bold;
  }
  i,
  em {
    font-style: italic;
  }
  u {
    text-decoration: underline;
  }
  code {
    font-family: monospace;
    background: ${props => props.theme.codeBlockBackground};
    padding: ${spacing._0_125} ${spacing._0_25};
    border-radius: ${borderRadius._6};
    padding-bottom: 0;
    display: inline-block;
  }
  h1 {
    font-size: ${font._36.size};
    line-height: ${font._36.lineHeight};
    font-weight: bold;
  }
  h2 {
    font-size: ${font._28.size};
    line-height: ${font._28.lineHeight};
    font-weight: bold;
  }
  ul li,
  ol li {
    list-style-position: inside;
    margin-bottom: ${spacing._0_5};
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  ul {
    li {
      list-style-type: disc;
    }
  }
  ol {
    li {
      list-style-type: decimal;
    }
  }
  blockquote {
    border-left: solid 4px ${props => props.theme.blockQuoteBorder};
    padding-left: ${spacing._0_5};
  }
  .node-unfocused {
    opacity: ${props =>
      props.distractionFree && !props.userScrolled ? 0.2 : 1};
    transition: all 300ms ease;
  }
  .node-focused {
    opacity: 1;
    transition: all 100ms ease;
  }
`;

const ToolbarWrapper = styled.div<{
  distractionFree: boolean;
  forceShow: boolean;
}>`
  flex: 0 0 auto;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  background: ${props => props.theme.toolbarBackground};
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: ${spacing._0_25} 0;
  position: ${props => (props.distractionFree ? "fixed" : "static")};
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 500ms ease;
  opacity: ${props => (props.distractionFree && !props.forceShow ? 0 : 1)};
  transform: ${props =>
    props.distractionFree && !props.forceShow
      ? "translateY(5px)"
      : "translateY(0px)"};
  z-index: 5;
  &:hover {
    opacity: 1;
    transform: translateY(0px);
    transition: all 200ms ease;
  }
`;

const ToolbarInner = styled(Wrapper)`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const ButtonSpacer = styled.div<{ small?: boolean }>`
  margin-right: ${props => (props.small ? spacing._0_125 : spacing._0_4)};
`;

const ToolbarExpandedWrapper = styled.div`
  padding-top: ${spacing._0_25};
  overflow: hidden;
  width: 100%;
`;

const ToolbarExpandedInner = styled.div`
  border-top: solid 1px ${props => props.theme.dropdownMenuSpacerBorder};
  padding-top: ${spacing._0_25};
  overflow: auto;
  max-height: 40vh;
`;

interface Props {
  id: string;
  initialValue: string;
  debounceValue?: number;
  onChange: (value: { content: string; title: string }) => void;
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
}

interface State {
  value: Value;
  userScrolled: boolean;
  isCtrlHeld: boolean;
}

function getTitleFromEditorValue(editorValue: Value): string | undefined {
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

const fallbackNoteContent = "<h1> </h1>";

function getInitialValue(props: Props): string {
  return props.initialValue && props.initialValue.length > 1
    ? props.initialValue
    : fallbackNoteContent;
}

export class InternoteEditor extends React.Component<Props, State> {
  debounceValue = 3000;
  preventScrollListener = false;
  scroller: ReturnType<typeof zenscroll.createScroller> = null;
  focusedNodeKey: string = "";
  editor: Editor | null = null;

  constructor(props: Props) {
    super(props);
    this.debounceValue = props.debounceValue || 3000;
    this.state = {
      value: serializer.deserialize(getInitialValue(props)) as any,
      userScrolled: false,
      isCtrlHeld: false
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        value: serializer.deserialize(getInitialValue(this.props)) as any
      });
    }
  }

  componentDidMount() {
    const editorScrollWrap = document.getElementById("editor-scroll-wrap");
    if (editorScrollWrap) {
      this.scroller = zenscroll.createScroller(editorScrollWrap, 200);
      editorScrollWrap.addEventListener("scroll", this.handleEditorScroll);
      editorScrollWrap.addEventListener("click", this.handleFocusModeScroll);
    }

    window.addEventListener("keyup", this.onKeyUp);
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = (editor: Editor) => {
    this.editor = editor;
  };

  onChange = (value: Value) => {
    this.setState({ value });
    this.emitChange(value);

    window.requestAnimationFrame(this.handleFocusModeScroll);
  };

  emitChange = debounce((editorValue: Value) => {
    this.props.onChange({
      content: serializer.serialize(editorValue as any),
      title: getTitleFromEditorValue(editorValue)
    });
  }, this.debounceValue);

  hasMark = (type: string): boolean => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

  hasBlock = (type: string): boolean => {
    const { value } = this.state;
    return value.blocks.some(node => node.type == type);
  };

  onKeyDown: Plugin["onKeyDown"] = (event, change, next) => {
    const inserted = this.handleResetBlockOnEnterPressed(event, change, next);

    if (inserted) {
      return inserted;
    }

    if (isCtrlHotKey(event)) {
      this.setState({ isCtrlHeld: true });
    }

    if (isBoldHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event, "bold");
    } else if (isItalicHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event, "italic");
    } else if (isUnderlinedHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event, "underlined");
    } else if (isCodeHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event, "code");
    } else if (isH1Hotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event, "heading-one");
    } else if (isH2Hotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event, "heading-two");
    } else if (isQuoteHotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event, "block-quote");
    } else if (isOlHotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event, "numbered-list");
    } else if (isUlHotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event, "bulleted-list");
    }
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
    const isEnterKey = event.keyCode === 13 && !event.shiftKey;
    const listBlockTypes = ["list-item"];
    const previousBlockType = change.value.focusBlock.type;
    const isListItem = listBlockTypes.indexOf(previousBlockType) !== -1;
    const lastBlockEmpty = change.value.startText.text.length === 0;
    const nextBlockIsListItem =
      !!change.value.nextBlock && change.value.nextBlock.type === "list-item";
    const shouldCloseList = lastBlockEmpty && !nextBlockIsListItem;
    if (isEnterKey && (!isListItem || shouldCloseList)) {
      if (shouldCloseList) {
        change.unwrapBlock("bulleted-list").unwrapBlock("numbered-list");
      }
      return change.splitBlock(0).insertBlock("paragraph");
    }

    next();
  };

  handleEditorScroll = throttle(
    () => {
      const editorScrollWrap = document.getElementById("editor-scroll-wrap");
      if (
        editorScrollWrap &&
        !this.state.userScrolled &&
        !this.preventScrollListener
      ) {
        this.setState({ userScrolled: true });
      }
    },
    1000,
    { leading: true, trailing: false }
  );

  handleFocusModeScroll = throttle(
    () => {
      if (this.props.distractionFree) {
        const focusedBlock = document.querySelector(".node-focused");
        const editorScrollWrap = document.getElementById("editor-scroll-wrap");
        if (focusedBlock && editorScrollWrap && this.scroller) {
          this.preventScrollListener = true;
          this.setState({ userScrolled: false }, () => {
            this.scroller.center(focusedBlock as HTMLElement, 200, 0, () => {
              window.requestAnimationFrame(() => {
                this.preventScrollListener = false;
              });
            });
          });
        }
      }
    },
    500,
    { leading: true }
  );

  onClickMark = (event: Event, type: MarkType) => {
    event.preventDefault();

    this.editor.toggleMark(type);

    this.onChange(this.editor.value);
  };

  onClickBlock = (event: Event, type: BlockType) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(
          block.key,
          (parent: any) => parent.type === type
        );
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
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

    this.onChange(editor.value);
  };

  onRequestSpeech = () => {
    const content = this.getSelectedContent();
    if (content && content.length) {
      this.props.onRequestSpeech(content);
    }
  };

  onToggleDictionary = () => {
    if (this.props.isDictionaryShowing) {
      this.props.closeDictionary();
    } else {
      const content = this.getSelectedContent();
      if (content && content.length) {
        const firstWord = content.split(" ")[0];
        if (firstWord) {
          this.props.onRequestDictionary(firstWord);
        }
      }
    }
  };

  getSelectedContent = () => {
    return this.hasSelection()
      ? this.state.value.fragment.text
      : this.state.value.focusBlock.text;
  };

  hasSelection = () =>
    this.state.value.fragment &&
    this.state.value.fragment.text &&
    this.state.value.fragment.text.length > 0;

  renderMarkButton = (type: MarkType, shortcutNumber: number) => {
    return (
      <ToolbarButton
        onMouseDown={(event: any) => this.onClickMark(event, type)}
        isActive={this.hasMark(type)}
        shortcutNumber={shortcutNumber}
        shortcutShowing={this.state.isCtrlHeld}
      >
        {type === "bold" ? (
          <FontAwesomeIcon icon={faBold} />
        ) : type === "italic" ? (
          <FontAwesomeIcon icon={faItalic} />
        ) : type === "underlined" ? (
          <FontAwesomeIcon icon={faUnderline} />
        ) : (
          <FontAwesomeIcon icon={faCode} />
        )}
      </ToolbarButton>
    );
  };

  renderBlockButton = (type: BlockType, shortcutNumber: number) => {
    let isActive = this.hasBlock(type);
    if (["numbered-list", "bulleted-list"].includes(type)) {
      const { value } = this.state;
      const first = value.blocks.first();
      if (first) {
        const parent: any = value.document.getParent(first.key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <ToolbarButton
        onMouseDown={(event: any) => this.onClickBlock(event, type)}
        isActive={isActive}
        shortcutNumber={shortcutNumber}
        shortcutShowing={this.state.isCtrlHeld}
      >
        {type === "heading-one" ? (
          <FontAwesomeIcon icon={faHeading} />
        ) : type === "heading-two" ? (
          "H2" // TODO: find an icon for representing heading-two
        ) : type === "block-quote" ? (
          <FontAwesomeIcon icon={faQuoteLeft} />
        ) : type === "bulleted-list" ? (
          <FontAwesomeIcon icon={faListUl} />
        ) : (
          <FontAwesomeIcon icon={faListOl} />
        )}
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
    const hasSelection = this.hasSelection();
    const shouldFocusNode =
      !hasSelection &&
      preventForBlocks.indexOf(node.type) === -1 &&
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

  render() {
    const isToolbarShowing =
      this.hasSelection() ||
      !!this.props.speechSrc ||
      this.state.isCtrlHeld ||
      this.props.isDictionaryShowing;

    return (
      <Wrap>
        <EditorStyles
          distractionFree={this.props.distractionFree}
          userScrolled={this.state.userScrolled}
          id="editor-scroll-wrap"
        >
          <Wrapper style={{ width: "100%" }}>
            <Editor
              placeholder=""
              ref={this.ref}
              value={this.state.value}
              onChange={change => this.onChange(change.value)}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.onKeyUp}
              renderBlock={this.renderBlock}
              renderMark={this.renderMark}
              autoFocus
              className="slate-editor"
            />
          </Wrapper>
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
            </Flex>
            <Flex alignItems="center">
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
