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
  isShiftEnterHotKey
} from "../utilities/editor";

// import "monaco-editor/esm/vs/editor/editor.api";
// await import("monaco-editor/esm/vs/editor/editor.api");

// TODO: https://github.com/ianstormtaylor/slate/issues/2504
// also: https://github.com/ianstormtaylor/slate/blob/master/examples/embeds/video.js#L30

export function Ide({
  className,
  node,
  editor,
  isFocused,
  ...props
}: {
  className?: string;
} & RenderBlockProps) {
  console.log(props);
  const [code, setCode] = useState(node.data.get("content"));

  const monacoEditor = useRef<MonacoEditorApi.editor.IStandaloneCodeEditor>(
    null
  );
  const monacoInstance = useRef<any>(null);

  const editorDidMount: EditorDidMount = (editor, monaco) => {
    monacoEditor.current = editor;
    monacoInstance.current = monaco;
  };

  useEffect(() => {
    if (monacoEditor.current) {
      const keydownBinding = monacoEditor.current.onKeyDown(e => {
        const position = monacoEditor.current.getPosition();
        if (!position) {
          return;
        }
        if (isShiftEnterHotKey(e.browserEvent)) {
          console.log("Break out of the editor in to a new line");
          return;
        }
        if (isBackspaceHotKey(e.browserEvent)) {
          if (monacoEditor.current.getModel().getValueLength() === 0) {
            console.log("Destroy this editor");
          }
          return;
        }
        if (isUpHotKey(e.browserEvent)) {
          if (position.lineNumber === 1) {
            console.log("Focus previous block");
          }
          return;
        }
        if (isDownHotKey(e.browserEvent)) {
          const lastLine = monacoEditor.current.getModel().getLinesContent()
            .length;
          if (position.lineNumber === lastLine) {
            console.log("Focus next block");
          }
          return;
        }
      });
      return () => {
        keydownBinding.dispose();
      };
    }
  }, [monacoEditor.current]);

  useEffect(() => {
    if (isFocused) {
      requestAnimationFrame(() => {
        monacoEditor.current.focus();
      });
    }
  }, [isFocused, monacoEditor.current]);

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

// TODO: these paths aren't working quite right. Maybe need to be absolute paths?
function getWorkerUrl(_workerId: string, label: string) {
  switch (label) {
    case "javascript":
    case "typescript":
      return "static/typescript.worker.js";
    default:
      return "static/editor.worker.js";
  }
}

// TODO: these paths aren't working quite right. Maybe need to be absolute paths?
(window as any).MonacoEnvironment = {
  getWorkerUrl(workerId: string, label: string) {
    const url = getWorkerUrl(workerId, label);
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`                        
                    self.MonacoEnvironment = {
                      baseUrl: '/static'
                    };
                    importScripts('${url}');`)}`;
  }
};
