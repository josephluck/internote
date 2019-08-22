import React, { useRef, useEffect } from "react";
import { RenderBlockProps } from "slate-react";
import { useState, useCallback } from "react";
import { EditorDidMount } from "react-monaco-editor";
import MonacoEditor from "react-monaco-editor/src/editor";
import * as MonacoEditorApi from "monaco-editor/esm/vs/editor/editor.api";
import {
  isUpHotKey,
  isDownHotKey,
  isBackspaceHotKey,
  isShiftEnterHotKey,
  isLeftHotKey,
  isRightHotKey
} from "../utilities/editor";
import { Block } from "slate";

// import "monaco-editor/esm/vs/editor/editor.api";
// await import("monaco-editor/esm/vs/editor/editor.api");

// TODO: https://github.com/ianstormtaylor/slate/issues/2504
// also: https://github.com/ianstormtaylor/slate/blob/master/examples/embeds/video.js#L30

export function Ide({
  className,
  node,
  editor,
  isFocused,
  onFocusNext,
  onFocusPrevious,
  onDestroy,
  onBreakToNewLine
}: {
  className?: string;
  onFocusPrevious: (node: Block) => void;
  onFocusNext: (node: Block) => void;
  onDestroy: (node: Block) => void;
  onBreakToNewLine: (node: Block) => void;
} & RenderBlockProps) {
  const [code, setCode] = useState(node.data.get("content"));

  const monaco = useRef<MonacoEditorApi.editor.IStandaloneCodeEditor>(null);

  const editorDidMount: EditorDidMount = editor => {
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
          onBreakToNewLine(node);
          return;
        }
        if (isBackspaceHotKey(e.browserEvent)) {
          if (monaco.current.getModel().getValueLength() === 0) {
            e.browserEvent.preventDefault();
            onDestroy(node);
          }
          return;
        }
        if (isUpHotKey(e.browserEvent)) {
          if (position.lineNumber === 1) {
            e.browserEvent.preventDefault();
            onFocusPrevious(node);
          }
          return;
        }
        if (isLeftHotKey(e.browserEvent)) {
          if (position.lineNumber === 1 && position.column === 1) {
            e.browserEvent.preventDefault();
            onFocusPrevious(node);
          }
          return;
        }
        if (isDownHotKey(e.browserEvent)) {
          const lastLine = monaco.current.getModel().getLinesContent().length;
          if (position.lineNumber === lastLine) {
            e.browserEvent.preventDefault();
            onFocusNext(node);
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
            onFocusNext(node);
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

  // useEffect(() => {
  //   if (monaco.current) {
  //     const focusBinding = monaco.current.onDidFocusEditorText(() => {
  //       onEditorFocussed();
  //       requestAnimationFrame(() => {
  //         monaco.current.focus();
  //       });
  //     });

  //     return () => {
  //       focusBinding.dispose();
  //     };
  //   }
  // }, [monaco.current, onEditorFocussed]);

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

  return (
    <div className={className}>
      <MonacoEditor
        onChange={onChange}
        value={code}
        language="typescript"
        theme="vs-dark"
        height="200"
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

(window as any).MonacoEnvironment = {
  getWorkerUrl(_workerId: string, label: string) {
    switch (label) {
      case "javascript":
      case "typescript":
        return "/static/typescript.worker.js";
      default:
        return "/static/editor.worker.js";
    }
  }
};
