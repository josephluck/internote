import { InternoteEditorElement } from "@internote/lib/editor-types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Editable, Slate } from "slate-react";
import styled, { css } from "styled-components";

import { useStately } from "../../store/store";
import { borderRadius, font, size, spacing } from "../../theming/symbols";
import { CreateLinkModal } from "../create-link-modal";
import { CreateSnippetModal } from "../create-snippet-modal";
import { LinksProvider } from "../links-context";
import { Outline } from "../outline";
import { ShortcutsContext } from "../shortcuts";
import { SnippetsProvider } from "../snippets-context";
import { Tag } from "../tag";
import { wrapperStyles } from "../wrapper";
import {
  SLATE_BLOCK_CLASS_NAME,
  SLATE_BLOCK_FOCUSED_CLASS_NAME,
} from "./focus";
import {
  COLLABORATION_ENABLED,
  InternoteEditorProvider,
  useCreateInternoteEditor,
  useInternoteEditor,
} from "./hooks";
import { sequenceKeyboardEventHandlers, useResetListBlocks } from "./hotkeys";
import { useLiveSave } from "./save";
import { useDistractionFreeUx } from "./scroll";
import { Toolbar } from "./toolbar";
import {
  InternoteEditorRenderElementProps,
  InternoteEditorRenderLeafProps,
  listNodeTypes,
  voids,
} from "./types";

export const InternoteEditor: React.FunctionComponent<{
  initialValue: InternoteEditorElement[];
  noteId?: string;
  autoFocus?: boolean;
  topPadding?: boolean;
}> = ({ initialValue, noteId, autoFocus = true, topPadding = true }) => {
  const valueRef = useRef(initialValue);
  valueRef.current = initialValue;

  const editor = useCreateInternoteEditor(noteId);

  /**
   * Connects the editor to sockets
   */
  useEffect(() => {
    if (COLLABORATION_ENABLED) {
      // @ts-ignore
      editor.connect();
      return editor.destroy as () => void;
    }
  }, [noteId]);

  const [value, setValue] = useState(initialValue);

  /**
   * Keeps editor value in sync with the current noteId, only when the noteId
   * changes.
   */
  useEffect(() => {
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };
    setValue(valueRef.current);
  }, [noteId]);

  const saving = useLiveSave(value, noteId);

  const [connected, setConnected] = useState(true);

  const handleToggleConnection = () => {
    if (connected) {
      // @ts-ignore
      editor.disconnect();
    } else {
      // @ts-ignore
      editor.connect();
    }
    setConnected((prev) => !prev);
  };

  return (
    <Slate editor={editor} value={value} onChange={setValue as any}>
      <InternoteEditorProvider>
        <SnippetsProvider>
          <LinksProvider>
            <InternoteEditorEditor
              autoFocus={autoFocus}
              topPadding={topPadding}
            />
            <Toolbar noteId={noteId} saving={saving} />
          </LinksProvider>
        </SnippetsProvider>
      </InternoteEditorProvider>
      {COLLABORATION_ENABLED && (
        <button
          onClick={handleToggleConnection}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 999 }}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      )}
    </Slate>
  );
};

const InternoteEditorEditor: React.FunctionComponent<{
  autoFocus: boolean;
  topPadding: boolean;
}> = ({ autoFocus, topPadding }) => {
  const { editor, handlePreventKeydown } = useInternoteEditor();

  const { handleShortcuts } = useContext(ShortcutsContext);

  const distractionFree = useStately(
    (state) => state.preferences.distractionFree
  );

  const outlineShowing = useStately(
    (state) => state.preferences.outlineShowing || false
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleResetListBlockOnPress = useResetListBlocks(editor);

  const { userHasScrolledOutOfDistractionMode } = useDistractionFreeUx(
    scrollRef
  );

  const handleKeyDown = useMemo(
    () =>
      sequenceKeyboardEventHandlers(
        handleShortcuts,
        handlePreventKeydown,
        handleResetListBlockOnPress
      ),
    [handlePreventKeydown, handleShortcuts, handleResetListBlockOnPress]
  );

  const renderElement = useCallback(
    (props: any) => <EditorElement {...props} />,
    []
  );

  const renderLeaf = useCallback((props: any) => <EditorLeaf {...props} />, []);

  return (
    <FullHeight>
      <InnerPadding ref={scrollRef} outlineShowing={outlineShowing}>
        <Editor
          userScrolled={userHasScrolledOutOfDistractionMode}
          distractionFree={distractionFree || false}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus={autoFocus}
          onKeyDown={handleKeyDown}
          topPadding={topPadding}
        />
      </InnerPadding>
      <Outline value={editor.children as any} />
      <CreateSnippetModal />
      <CreateLinkModal />
    </FullHeight>
  );
};

const EditorElement: React.FunctionComponent<InternoteEditorRenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const attrs = {
    ...attributes,
    className:
      listNodeTypes.includes(element.type) || voids.includes(element.type)
        ? ""
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
    case "tag": {
      return (
        <Tag {...attrs} isFocused large>
          {element.tag}
          {children}
        </Tag>
      );
    }
    case "link": {
      return (
        <a
          href={element.href}
          style={{ cursor: element.openImmediately ? "pointer" : "inherit" }}
          onMouseDown={(e) => {
            if (e.ctrlKey || element.openImmediately) {
              e.preventDefault();
              e.stopPropagation();
              window.open(
                element.href,
                element.openImmediately ? "_self" : "_blank"
              );
            }
          }}
        >
          {children}
        </a>
      );
    }
    default:
      return <p {...attrs}>{children}</p>;
  }
};

const EditorLeaf: React.FunctionComponent<InternoteEditorRenderLeafProps> = ({
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
  overflow-x: hidden;
  position: relative;
`;

const InnerPadding = styled.div.withConfig({
  shouldForwardProp: (prop: React.ReactText, def) =>
    !(["outlineShowing"] as React.ReactText[]).includes(prop) && def(prop),
})<{ outlineShowing?: boolean }>`
  ${fullHeightStyles};
  min-height: 100%;
  height: 100%;
  padding: ${spacing._2} 0 ${spacing._1};
  padding-right: ${(props) => (props.outlineShowing ? size.outlineWidth : 0)};
  overflow-x: hidden;
`;

export const Editor = styled(Editable).withConfig({
  shouldForwardProp: (prop: React.ReactText) =>
    !(["distractionFree", "userScrolled"] as React.ReactText[]).includes(prop),
})<{
  distractionFree: boolean;
  userScrolled: boolean;
  topPadding: boolean;
}>`
  min-height: 100%;
  ${wrapperStyles};
  padding-top: ${(props) => (props.topPadding ? "50vh" : spacing._3)};
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
  a {
    color: ${(props) => props.theme.anchorText};
    text-decoration: underline;
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
