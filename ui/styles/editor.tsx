import React from "react";
import { serializer, MarkType, BlockType } from "../utilities/serializer";
import { Editor, Plugin } from "slate-react";
import { debounce } from "lodash";
import isKeyHotkey from "is-hotkey";
import { spacing, color, font, borderRadius } from "./theme";
import styled from "styled-components";
import { Saving } from "./saving";
import { Flex } from "grid-styled";
import { Wrapper } from "./wrapper";
import { Button, FormatButton } from "./button";
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
  faListOl
} from "@fortawesome/free-solid-svg-icons";

const DEFAULT_NODE = "paragraph";

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

const ToolbarWrapper = Wrapper.extend`
  position: fixed;
  bottom: ${spacing._1};
  left: ${spacing._0};
  right: ${spacing._0};
  z-index: 5;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;

const ToolbarInner = styled.div`
  padding: ${spacing._0_5};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadius.pill};
  background: ${color.black};
`;

const ToolbarButton = FormatButton.extend`
  margin-right: ${spacing._0_25};
`;

const EditorStyles = styled.div`
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
    background: ${color.shipGray};
    padding: ${spacing._0_125};
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
`;

interface Props {
  id: string;
  initialValue: string;
  debounceValue?: number;
  onChange: (value: string) => void;
  exposeEditor: (ref: any) => void;
  onDelete: () => void;
  saving: boolean;
}

interface State {
  value: Value;
}

export class InternoteEditor extends React.Component<Props, State> {
  debounceValue = 1000;

  constructor(props: Props) {
    super(props);
    this.debounceValue = props.debounceValue || 1000;
    this.state = {
      value: serializer.deserialize(props.initialValue || "")
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        value: serializer.deserialize(this.props.initialValue || "")
      });
    }
  }

  onChange = ({ value }: Change) => {
    this.setState({ value: value });
    this.emitChange(value);
  };

  emitChange = debounce((editorValue: any) => {
    this.props.onChange(serializer.serialize(editorValue));
  }, this.debounceValue);

  hasMark = (type: string): boolean => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

  hasBlock = (type: string): boolean => {
    const { value } = this.state;
    return value.blocks.some(node => node.type == type);
  };

  onKeyDown: Plugin["onKeyDown"] = (event, change) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
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
        return !!document.getClosest(block.key, parent => parent.type == type);
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
      const parent = value.document.getParent(value.blocks.first().key);
      isActive = this.hasBlock("list-item") && parent && parent.type === type;
    }

    return (
      <ToolbarButton
        onMouseDown={event => this.onClickBlock(event, type)}
        isActive={isActive}
      >
        {type === "heading-one" ? (
          <FontAwesomeIcon icon={faHeading} />
        ) : type === "heading-two" ? (
          <FontAwesomeIcon icon={faHeading} />
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
    switch (node.type) {
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
      <EditorStyles>
        <Editor
          placeholder=""
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          ref={this.props.exposeEditor}
        />
        <ToolbarWrapper>
          <ToolbarInner>
            <Flex flex="1" alignItems="center">
              {this.renderMarkButton("bold")}
              {this.renderMarkButton("italic")}
              {this.renderMarkButton("underlined")}
              {this.renderMarkButton("code")}
              {this.renderBlockButton("heading-one")}
              {this.renderBlockButton("heading-two")}
              {this.renderBlockButton("block-quote")}
              {this.renderBlockButton("numbered-list")}
              {this.renderBlockButton("bulleted-list")}
            </Flex>
            <Flex alignItems="center">
              <Flex mr={spacing._0_5}>
                <Button small secondary onClick={this.props.onDelete}>
                  Delete
                </Button>
              </Flex>
              <Flex mr={spacing._0_25}>
                <Saving saving={this.props.saving} />
              </Flex>
            </Flex>
          </ToolbarInner>
        </ToolbarWrapper>
      </EditorStyles>
    );
  }
}
