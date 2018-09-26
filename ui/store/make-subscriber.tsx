import * as React from "react";
import { Twine } from "twine-js";

export function makeSubscriber<S extends Twine.Return<any, any>>(store: S) {
  type ConnectedComponent = (
    store: { actions: S["actions"]; state: S["state"] }
  ) => React.ReactNode;

  interface Props {
    children: ConnectedComponent | React.ReactNode;
  }

  interface ComponentState {
    state: S["actions"];
    actions: S["state"];
  }

  return class Subscribe extends React.Component<Props, ComponentState> {
    unsubscribe = null;

    constructor(props: Props) {
      super(props);

      this.state = {
        state: store.state,
        actions: store.actions
      };
    }

    componentDidMount() {
      this.unsubscribe = store.subscribe(this.onStoreChange);
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe;
      }
    }

    onStoreChange = (state: S["state"]) => {
      this.setState({ state });
    };

    render() {
      return typeof this.props.children === "function"
        ? this.props.children(this.state)
        : this.props.children;
    }
  };
}
