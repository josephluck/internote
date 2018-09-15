import React from "react";
import { Editor as DraftEditor, EditorState, ContentState } from "draft-js";

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

  onChange = (editorState: EditorState) => this.setState({ editorState });

  render() {
    return (
      <DraftEditor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }
}
