import React from "react";
import { EditorState } from "draft-js";
import dynamic from "next/dynamic";
import { debounce } from "lodash";

const DraftEditor = dynamic(import("draft-js").then(module => module.Editor), {
  ssr: false
});

interface Props {
  id: string;
  initialValue: string;
  debounceValue?: number;
  onChange: (value: string) => void;
}

interface State {
  editorState: EditorState;
  ready: boolean;
}

export class Editor extends React.Component<Props, State> {
  convertToHTML = null;
  convertFromHTML = null;
  debounceValue = 1000;

  constructor(props: Props) {
    super(props);
    this.debounceValue = props.debounceValue || 1000;
    this.state = {
      editorState: EditorState.createEmpty(),
      ready: false
    };
  }

  async componentDidMount() {
    if (!this.convertToHTML || !this.convertFromHTML) {
      await import("draft-convert").then(m => {
        this.convertToHTML = m.convertToHTML;
        this.convertFromHTML = m.convertFromHTML;
      });
    }
    this.setState({
      editorState: EditorState.createWithContent(
        this.convertFromHTML(this.props.initialValue || "")
      ),
      ready: true
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        editorState: EditorState.createWithContent(
          this.convertFromHTML(this.props.initialValue || "")
        )
      });
    }
  }

  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
    this.emitChange(editorState);
  };

  emitChange = debounce(
    (editorState: EditorState) => {
      this.props.onChange(this.convertToHTML(editorState.getCurrentContent()));
    },
    this.debounceValue,
    { leading: true }
  );

  render() {
    return this.state.ready ? (
      <DraftEditor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    ) : null;
  }
}
