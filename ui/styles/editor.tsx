import React from "react";
import { EditorState, Editor } from "draft-js";
import { debounce } from "lodash";

interface Props {
  id: string;
  initialValue: string;
  debounceValue?: number;
  onChange: (value: string) => void;
  exposeEditor?: (editor: Editor) => void;
}

interface State {
  editorState: EditorState;
  ready: boolean;
}

export class InternoteEditor extends React.Component<Props, State> {
  convertToHTML = null;
  convertFromHTML = null;
  debounceValue = 1000;
  editorInstance: null | Editor = null;

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

  onEditorRefObtained = (editor: Editor) => {
    this.editorInstance = editor;
    if (this.editorInstance) {
      this.editorInstance.focus();
      this.exposeEditorRef();
    }
  };

  exposeEditorRef = () => {
    this.props.exposeEditor(this.editorInstance);
  };

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
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        ref={this.onEditorRefObtained}
      />
    ) : null;
  }
}
