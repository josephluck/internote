import React, { useCallback, useRef, useState } from "react";
import { Node } from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from "slate-react";
import styled, { css } from "styled-components";
import { useTwineState } from "../../store";
import { borderRadius, font, spacing } from "../../theming/symbols";
import { wrapperStyles } from "../wrapper";
import { useCreateInternoteEditor } from "./hooks";
import { useEditorShortcut } from "./hotkeys";
import { useLiveSave } from "./save";
import { Toolbar } from "./toolbar";
import { InternoteSlateEditor } from "./types";

export const InternoteEditor: React.FunctionComponent<{
  initialValue: Node[];
  noteId: string;
}> = ({ initialValue, noteId }) => {
  const distractionFree = useTwineState(
    (state) => state.preferences.distractionFree
  );
  const editor: InternoteSlateEditor = useCreateInternoteEditor();

  const [value, setValue] = useState(initialValue);

  useLiveSave(value, noteId);

  const scrollRef = useRef<HTMLDivElement>();

  const handleKeyboardShortcut = useEditorShortcut(editor);

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <FullHeight>
        <InnerPadding ref={scrollRef}>
          <Editor
            userScrolled={false}
            distractionFree={distractionFree}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
            autoFocus
            onKeyDown={handleKeyboardShortcut}
          />
        </InnerPadding>
      </FullHeight>
      <Toolbar noteId={noteId} />
    </Slate>
  );
};

const Element: React.FunctionComponent<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
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
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf: React.FunctionComponent<RenderLeafProps> = ({
  attributes,
  children,
  leaf,
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const fullHeightStyles = css`
  min-height: 100%;
  height: 100%;
`;

const FullHeight = styled.div`
  ${fullHeightStyles};
`;

const InnerPadding = styled.div`
  ${fullHeightStyles};
  min-height: 100%;
  height: 100%;
  padding: ${spacing._2} 0 ${spacing._1};
  overflow-x: hidden;
`;

export const Editor = styled(Editable)<{
  distractionFree: boolean;
  userScrolled: boolean;
}>`
  min-height: 100%;
  ${wrapperStyles};
  font-family: ${(props) => props.theme.fontFamily};
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
    background: ${(props) => props.theme.codeBlockBackground};
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
    border-left: solid 4px ${(props) => props.theme.blockQuoteBorder};
    color: ${(props) => props.theme.blockQuoteText};
    padding-left: ${spacing._0_5};
    margin-left: 0;
    font-size: ${font._18.size};
    line-height: ${font._18.lineHeight};
  }
  .node-unfocused {
    opacity: ${(props) =>
      props.distractionFree && !props.userScrolled ? 0.2 : 1};
    transition: all 300ms ease;
  }
  .node-focused {
    opacity: 1;
    transition: all 100ms ease;
  }
`;
