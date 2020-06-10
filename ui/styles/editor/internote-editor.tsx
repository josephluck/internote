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
import {
  elmHasChildFocus,
  SLATE_BLOCK_CLASS_NAME,
  SLATE_BLOCK_FOCUSED_CLASS_NAME,
} from "./focus";
import { useCreateInternoteEditor } from "./hooks";
import { useFormattingHotkey, useResetListBlocks } from "./hotkeys";
import { useLiveSave } from "./save";
import { useScrollFocus } from "./scroll";
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

  const handleFormattingShortcut = useFormattingHotkey(editor);
  const handleResetListBlockOnPress = useResetListBlocks(editor);

  const {
    scrollToFocusedNode,
    userHasScrolledOutOfDistractionMode,
  } = useScrollFocus(editor, scrollRef);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const handled = handleFormattingShortcut(event);
      if (!handled) {
        handleResetListBlockOnPress(event);
      }
    },
    [handleFormattingShortcut, handleResetListBlockOnPress]
  );

  const handleKeyUp = useCallback(() => {
    if (distractionFree) {
      requestAnimationFrame(scrollToFocusedNode);
    }
  }, [scrollToFocusedNode, distractionFree]);

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <FullHeight>
        <InnerPadding ref={scrollRef}>
          <Editor
            userScrolled={userHasScrolledOutOfDistractionMode}
            distractionFree={distractionFree}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
            autoFocus
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
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
  const isFocused =
    !!attributes.ref.current && elmHasChildFocus(attributes.ref.current);

  const attrs = {
    ...attributes,
    className: isFocused
      ? [SLATE_BLOCK_CLASS_NAME, SLATE_BLOCK_FOCUSED_CLASS_NAME].join(" ")
      : SLATE_BLOCK_CLASS_NAME,
  };

  switch (element.type) {
    case "block-quote":
      return <blockquote {...attrs}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attrs}>{children}</ul>;
    case "heading-one":
      return <h1 {...attrs}>{children}</h1>;
    case "heading-two":
      return <h2 {...attrs}>{children}</h2>;
    case "list-item":
      return <li {...attrs}>{children}</li>;
    case "numbered-list":
      return <ol {...attrs}>{children}</ol>;
    default:
      return <p {...attrs}>{children}</p>;
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
  padding-top: 50vh;
  padding-bottom: 50vh;
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
  .${SLATE_BLOCK_CLASS_NAME} {
    opacity: ${(props) =>
      props.distractionFree && !props.userScrolled ? 0.2 : 1};
    transition: all 300ms ease;
    .${SLATE_BLOCK_CLASS_NAME} {
      opacity: 1;
    }
  }
  .${SLATE_BLOCK_FOCUSED_CLASS_NAME} {
    opacity: 1;
    transition: all 100ms ease;
  }
`;
