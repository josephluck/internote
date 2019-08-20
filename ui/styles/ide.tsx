import React from "react";
import { RenderBlockProps } from "slate-react";
import { useState, useCallback } from "react";
import MonacoEditor from "react-monaco-editor/src/editor";

// await import('monaco-editor/esm/vs/editor/editor.api');

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
      />
    </div>
  );
}

function getWorkerUrl(_workerId: string, label: string) {
  switch (label) {
    case "javascript":
    case "typescript":
      return "/static/typescript.worker.js";
    default:
      return "/static/editor.worker.js";
  }
}

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
