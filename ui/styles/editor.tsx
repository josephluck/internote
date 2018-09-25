import React from "react";
import { serializer } from "../utilities/serializer";
import { Editor } from "slate-react";
import { debounce } from "lodash";

interface Props {
  id: string;
  initialValue: string;
  debounceValue?: number;
  onChange: (value: string) => void;
  exposeEditor: (ref: any) => void;
}

interface State {
  editorValue: any;
}

export class InternoteEditor extends React.Component<Props, State> {
  debounceValue = 1000;

  constructor(props: Props) {
    super(props);
    this.debounceValue = props.debounceValue || 1000;
    this.state = {
      editorValue: serializer.deserialize(props.initialValue || "")
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        editorValue: serializer.deserialize(this.props.initialValue || "")
      });
    }
  }

  onChange = ({ value }: any) => {
    this.setState({ editorValue: value });
    this.emitChange(value);
  };

  emitChange = debounce((editorValue: any) => {
    this.props.onChange(serializer.serialize(editorValue));
  }, this.debounceValue);

  render() {
    return (
      <Editor
        placeholder=""
        value={this.state.editorValue}
        onChange={this.onChange}
        ref={this.props.exposeEditor}
      />
    );
  }
}
