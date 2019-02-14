import * as React from "react";
import isKeyHotkey from "is-hotkey";

interface Props {
  keyCombo: string;
  cb: () => void;
}

export class OnKeyboardShortcut extends React.Component<Props, {}> {
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (event: Event) => {
    const isHotkey = isKeyHotkey(this.props.keyCombo);
    if (isHotkey(event)) {
      event.preventDefault();
      this.props.cb();
    }
  };

  render() {
    return <></>;
  }
}
