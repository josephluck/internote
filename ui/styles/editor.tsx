import React from "react";
import { EditorState, ContentState } from "draft-js";
import dynamic from "next/dynamic";

const DraftEditor = dynamic(import("draft-js").then(module => module.Editor), {
  ssr: false
});

interface Props {
  initialValue?: string;
}

interface State {
  editorState: EditorState;
}

export class Editor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(props.initialValue || "")
      )
    };
  }

  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
  };

  render() {
    return (
      <DraftEditor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }
}
