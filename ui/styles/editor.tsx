import React from "react";
import { serializer, MarkType, BlockType } from "../utilities/serializer";
import { Editor, Plugin } from "slate-react";
import { debounce } from "lodash";
import isKeyHotkey from "is-hotkey";
import { spacing, font, borderRadius } from "../theming/symbols";
import { styled } from "../theming/styled";
import { Saving } from "./saving";
import { Flex } from "@rebass/grid";
import { RoundButton } from "./button";
import { Change, Value } from "slate";
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
  faTrash
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_NODE = "paragraph";

// Keyboard shortcuts

const isH1Hotkey = isKeyHotkey("mod+1");
const isH2Hotkey = isKeyHotkey("mod+2");
const isOlHotkey = isKeyHotkey("mod+3");
const isUlHotkey = isKeyHotkey("mod+4");
const isCodeHotkey = isKeyHotkey("mod+5") || isKeyHotkey("mod+`");
const isQuoteHotkey = isKeyHotkey("mod+6") || isKeyHotkey("mod+'");
const isBoldHotkey = isKeyHotkey("mod+7") || isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+8") || isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+9") || isKeyHotkey("mod+u");

const ToolbarWrapper = styled.div`
  position: sticky;
  margin-left: auto;
  bottom: ${spacing._1};
  right: ${spacing._0};
  margin-right: -${spacing._2};
  z-index: 5;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  float: right;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const ToolbarInner = styled.div`
  padding: ${spacing._0_25} ${spacing._0_25} ${spacing._0_125};
  margin-top: ${spacing._0_25};
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadius.pill};
  background: ${props => props.theme.toolbarBackground};
`;

const ToolbarButton = styled(RoundButton)`
  margin-bottom: ${spacing._0_125};
`;

const EditorStyles = styled.div`
  padding-right: ${spacing._2};
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
    list-style-position: outside;
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
`;

interface Props {
  id: string;
  initialValue: string;
  debounceValue?: number;
  onChange: (value: { content: string; title: string }) => void;
  onDelete: () => void;
  saving: boolean;
}

interface State {
  value: Value;
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

  constructor(props: Props) {
    super(props);
    this.debounceValue = props.debounceValue || 3000;
    this.state = {
      value: serializer.deserialize(getInitialValue(props))
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        value: serializer.deserialize(getInitialValue(this.props))
      });
    }
  }

  onChange = ({ value }: Change) => {
    this.setState({ value });
    this.emitChange(value);
  };

  emitChange = debounce((editorValue: any) => {
    this.props.onChange({
      content: serializer.serialize(editorValue),
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

  onKeyDown: Plugin["onKeyDown"] = (event, _change) => {
    if (isBoldHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event as any, "bold");
    } else if (isItalicHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event as any, "italic");
    } else if (isUnderlinedHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event as any, "underlined");
    } else if (isCodeHotkey(event)) {
      event.preventDefault();
      this.onClickMark(event as any, "code");
    } else if (isH1Hotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event as any, "heading-one");
    } else if (isH2Hotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event as any, "heading-two");
    } else if (isQuoteHotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event as any, "block-quote");
    } else if (isOlHotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event as any, "numbered-list");
    } else if (isUlHotkey(event)) {
      event.preventDefault();
      this.onClickBlock(event as any, "bulleted-list");
    }
  };

  onClickMark = (event: React.MouseEvent<HTMLElement>, type: MarkType) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  onClickBlock = (event: React.MouseEvent<HTMLElement>, type: BlockType) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(
          block.key,
          (parent: any) => parent.type == type
        );
      });

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        change
          .unwrapBlock(
            type == "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        change.setBlocks("list-item").wrapBlock(type);
      }
    }

    this.onChange(change);
  };

  renderMarkButton = (type: MarkType) => {
    const isActive = this.hasMark(type);

    return (
      <ToolbarButton
        onMouseDown={event => this.onClickMark(event, type)}
        isActive={isActive}
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

  renderBlockButton = (type: BlockType) => {
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
        onMouseDown={event => this.onClickBlock(event, type)}
        isActive={isActive}
      >
        {type === "heading-one" ? (
          <FontAwesomeIcon icon={faHeading} />
        ) : type === "heading-two" ? (
          "H2"
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

  renderNode: Plugin["renderNode"] = ({ attributes, children, node }) => {
    switch ((node as any).type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
    }
  };

  renderMark: Plugin["renderMark"] = props => {
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
    }
  };

  render() {
    return (
      <>
        <EditorStyles>
          <Editor
            placeholder=""
            value={this.state.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderNode={this.renderNode}
            renderMark={this.renderMark}
          />

          <ToolbarWrapper>
            <ToolbarInner>
              {this.renderBlockButton("heading-one")}
              {this.renderBlockButton("heading-two")}
              {this.renderBlockButton("numbered-list")}
              {this.renderBlockButton("bulleted-list")}
              {this.renderMarkButton("code")}
              {this.renderBlockButton("block-quote")}
              {this.renderMarkButton("bold")}
              {this.renderMarkButton("italic")}
              {this.renderMarkButton("underlined")}
            </ToolbarInner>
            <ToolbarInner>
              <Flex mb={spacing._0_25}>
                <ToolbarButton isActive={false} onClick={this.props.onDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </ToolbarButton>
              </Flex>
              <Flex mb={spacing._0_25}>
                <Saving saving={this.props.saving} />
              </Flex>
            </ToolbarInner>
          </ToolbarWrapper>
        </EditorStyles>
      </>
    );
  }
}
