import * as React from "react";
import { store, State, Actions } from "./index";

type ConnectedComponent = (
  store: { actions: Actions; state: State }
) => React.ReactNode;

interface Props {
  children: ConnectedComponent | React.ReactNode;
}

interface ComponentState {
  state: State;
  actions: Actions;
}

export class Subscribe extends React.Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      state: store.state,
      actions: store.actions
    };
  }

  componentDidMount() {
    store.subscribe(this.onStoreChange);
  }

  onStoreChange = (state: State) => {
    this.setState({ state });
  };

  render() {
    return typeof this.props.children === "function"
      ? this.props.children(this.state)
      : this.props.children;
  }
}
