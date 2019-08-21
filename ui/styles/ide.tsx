import React from "react";
import { RenderBlockProps } from "slate-react";
import { useState, useCallback } from "react";
import MonacoEditor from "react-monaco-editor/src/editor";

// import "monaco-editor/esm/vs/editor/editor.api";
// await import("monaco-editor/esm/vs/editor/editor.api");

// TODO: https://github.com/ianstormtaylor/slate/issues/2504
// also: https://github.com/ianstormtaylor/slate/blob/master/examples/embeds/video.js#L30

export function Ide({
  className,
  node,
  editor,
  ...props
}: {
  className?: string;
} & RenderBlockProps) {
  console.log(props);
  const [code, setCode] = useState(node.data.get("content"));
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
