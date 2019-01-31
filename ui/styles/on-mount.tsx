import * as React from "react";

export class OnMount extends React.Component<{ action: () => any }, {}> {
  componentDidMount() {
    this.props.action();
  }

  render() {
    return null;
  }
}
