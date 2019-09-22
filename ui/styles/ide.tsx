import React, { useRef, useEffect } from "react";
import { RenderBlockProps } from "slate-react";
import { useState, useCallback } from "react";
import {
  isUpHotKey,
  isDownHotKey,
  isBackspaceHotKey,
  isShiftEnterHotKey,
  isLeftHotKey,
  isRightHotKey
} from "../utilities/editor";
import { Block } from "slate";
import { throttle } from "lodash";
import { isServer } from "../utilities/window";

const LINE_HEIGHT = 30;

const MonacoEditor = !isServer() ? (window as any).reactMonacoEditor : null as any;

export function Ide({
  className,
  node,
  editor,
  isFocused,
  onFocusNext,
  onFocusPrevious,
  onDestroy,
  onBreakToNewLine,
  onClick
}: {
  className?: string;
  onFocusPrevious: (node: Block) => void;
  onFocusNext: (node: Block) => void;
  onDestroy: (node: Block) => void;
  onBreakToNewLine: (node: Block) => void;
  onClick: (node: Block) => void;
} & RenderBlockProps) {
  const content = node.data.get("content") || "";
  const [code, setCode] = useState(content);
  const [height, setHeight] = useState(() =>
    constrainToMaxHeight(content.split("\n").length * LINE_HEIGHT)
  );

  const monaco = useRef(null);

  const editorDidMount = (editor: any) => {
    monaco.current = editor;
  };

  useEffect(() => {
    if (monaco.current) {
      const keydownBinding = monaco.current.onKeyDown(e => {
        const position = monaco.current.getPosition();
        if (!position) {
          return;
        }
        if (isShiftEnterHotKey(e.browserEvent)) {
          e.browserEvent.preventDefault();
          onBreakToNewLine(node as any);
          return;
        }
        if (isBackspaceHotKey(e.browserEvent)) {
          if (monaco.current.getModel().getValueLength() === 0) {
            e.browserEvent.preventDefault();
            onDestroy(node as any);
          }
          return;
        }
        if (isUpHotKey(e.browserEvent)) {
          if (position.lineNumber === 1) {
            e.browserEvent.preventDefault();
            onFocusPrevious(node as any);
          }
          return;
        }
        if (isLeftHotKey(e.browserEvent)) {
          if (position.lineNumber === 1 && position.column === 1) {
            e.browserEvent.preventDefault();
            onFocusPrevious(node as any);
          }
          return;
        }
        if (isDownHotKey(e.browserEvent)) {
          const lastLine = monaco.current.getModel().getLinesContent().length;
          if (position.lineNumber === lastLine) {
            e.browserEvent.preventDefault();
            onFocusNext(node as any);
          }
          return;
        }
        if (isRightHotKey(e.browserEvent)) {
          const lastLine = monaco.current.getModel().getLinesContent().length;
          const lastColumn = monaco.current
            .getModel()
            .getLineLastNonWhitespaceColumn(lastLine);
          const atLastLine = position.lineNumber === lastLine;
          const atLastColumn =
            position.column === lastColumn ||
            (lastColumn === 0 && position.column === 1);
          if (atLastLine && atLastColumn) {
            e.browserEvent.preventDefault();
            onFocusNext(node as any);
          }
          return;
        }
      });
      return () => {
        keydownBinding.dispose();
      };
    }
  }, [
    monaco.current,
    onDestroy,
    onFocusNext,
    onFocusPrevious,
    onBreakToNewLine
  ]);

  useEffect(() => {
    if (isFocused) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => monaco.current.focus())
      );
    }
  }, [isFocused, monaco.current]);

  const onChange = useCallback((changes: any) => {
    setCode(changes);
    editor.setNodeByKey(node.key, {
      object: "block",
      type: "ide",
      data: { content: changes }
    });
  }, []);

  useEffect(() => {
    const resize = throttle(
      () => {
        requestAnimationFrame(() => {
          const lines = monaco.current.getModel().getLinesContent().length;
          setHeight(constrainToMaxHeight(lines * LINE_HEIGHT));
        });
      },
      200,
      { leading: true, trailing: true }
    );
    const resizeBinding = monaco.current.onDidChangeModelDecorations(resize);
    return () => {
      resizeBinding.dispose();
    };
  }, [monaco.current]);

  if (isServer()) {
    return null;
  }

  return (
    <div className={className} onClick={() => onClick(node as any)}>
      <MonacoEditor
        onChange={onChange}
        value={code}
        language="typescript"
        theme="vs-dark"
        height={height}
        editorDidMount={editorDidMount}
        options={{
          extraEditorClassName: "", // TODO styles
          minimap: {
            enabled: false
          },
          scrollBeyondLastLine: false,
          wordWrap: "off", // TODO: maybe set this to on?
          links: false,
          contextmenu: false,
          formatOnType: true,
          codeLens: true,
          lineNumbers: "off",
          folding: false,
          renderIndentGuides: false,
          renderLineHighlight: "gutter", // TODO: tweak this
          fontFamily: "Overpass Mono", // TODO: ???
          fontWeight: "normal", // TODO: ???
          fontSize: 24, // TODO: ???
          lineHeight: 30, // TODO: ???
          letterSpacing: 0 // TODO: ???
        }}
      />
    </div>
  );
}

if (!isServer()) {
  (window as any).MonacoEnvironment = {
    getWorkerUrl(_workerId: string, label: string) {
      switch (label) {
        case "javascript":
        case "typescript":
          return "/static/monaco/ts.worker.js";
        default:
          return "/static/monaco/editor.worker.js";
      }
    }
  };
}

const MAX_HEIGHT = 300;

const constrainToMaxHeight = (targetHeight: number) => {
  if (targetHeight < LINE_HEIGHT) {
    return LINE_HEIGHT;
  }
  return targetHeight > MAX_HEIGHT ? MAX_HEIGHT : targetHeight;
};
