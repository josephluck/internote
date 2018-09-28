import React from "react";
import { serializer } from "../utilities/serializer";
import { Editor, Plugin } from "slate-react";
import { debounce } from "lodash";
import isKeyHotkey from "is-hotkey";
import { spacing, color, font, borderRadius } from "./theme";
import styled from "styled-components";
import { Saving } from "./saving";
import { ToolbarBlock } from "./toolbar-block";
import { Flex } from "grid-styled";
import { Wrapper } from "./wrapper";
import { Button } from "./button";
import { Change, Value } from "slate";

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
  padding: ${spacing._0_5} ${spacing._1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadius._6};
  background: ${color.black};
`;

const EditorStyles = styled.div`
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

  renderMarkButton = (type: string, icon: string) => {
    const isActive = this.hasMark(type);
    console.log({ isActive });

    return (
      <button onMouseDown={event => this.onClickMark(event, type)}>
        {icon}
      </button>
    );
  };

  renderBlockButton = (type: string, icon: string) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      const { value } = this.state;
      const parent = value.document.getParent(value.blocks.first().key);
      isActive = this.hasBlock("list-item") && parent && parent.type === type;
    }

    console.log({ isActive });

    return (
      <button onMouseDown={event => this.onClickBlock(event, type)}>
        {icon}
      </button>
    );
  };

  renderNode: Plugin["renderNode"] = props => {
    const { attributes, children, node } = props;

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

    switch (mark.type) {
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

  onClickMark = (event: React.MouseEvent<HTMLButtonElement>, type: string) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  onClickBlock = (event: React.MouseEvent<HTMLButtonElement>, type: string) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    // Handle everything but list buttons.
    if (type != "bulleted-list" && type != "numbered-list") {
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

  render() {
    const words = 0; // TODO
    const minutes = 1; // TODO
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
            <Flex flex="1">
              {this.renderMarkButton("bold", "format_bold")}
              {this.renderMarkButton("italic", "format_italic")}
              {this.renderMarkButton("underlined", "format_underlined")}
              {this.renderMarkButton("code", "code")}
              {this.renderBlockButton("heading-one", "looks_one")}
              {this.renderBlockButton("heading-two", "looks_two")}
              {this.renderBlockButton("block-quote", "format_quote")}
              {this.renderBlockButton("numbered-list", "format_list_numbered")}
              {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
              <ToolbarBlock>
                {words} words ({minutes} {minutes === 1 ? "min" : "mins"})
              </ToolbarBlock>
            </Flex>
            <Flex alignItems="center">
              <Flex mr={spacing._0_5}>
                <Button small secondary onClick={this.props.onDelete}>
                  Delete
                </Button>
              </Flex>
              <Flex>
                <Saving saving={this.props.saving} />
              </Flex>
            </Flex>
          </ToolbarInner>
        </ToolbarWrapper>
      </EditorStyles>
    );
  }
}
