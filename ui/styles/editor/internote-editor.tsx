import React, { useCallback, useState } from "react";
import { Node } from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from "slate-react";
import { useCreateInternoteEditor } from "./hooks";
import { useEditorShortcut } from "./hotkeys";
import { InternoteSlateEditor } from "./types";
import { Toolbar } from "./toolbar";

export const InternoteEditor: React.FunctionComponent<{
  initialValue: Node[];
}> = ({ initialValue }) => {
  const editor: InternoteSlateEditor = useCreateInternoteEditor();
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = useEditorShortcut(editor);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
        onKeyDown={handleKeyDown}
      />
      <Toolbar />
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
