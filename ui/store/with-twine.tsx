import * as React from "react";
import { Twine } from "twine-js";
import { NextContext, QueryStringMapObject } from "next";

interface State {
  storeState: any;
}

export function withTwine<S, A>(
  makeStore: () => Twine.Return<S, A>,
  Child: any
) {
  return class WithTwine extends React.Component<{}, State> {
    store = makeStore();
    unsubscribe = () => null;

    constructor(props, context) {
      super(props, context);

      const { initialState, store } = props;
      const hasStore = store && "state" in store && "actions" in store;

      if (hasStore) {
        this.store = store;
      } else {
        const newStore = makeStore();
        newStore.state = initialState;
        this.store = newStore;
      }

      this.state = {
        storeState: this.store.state
      };
    }

    static async getInitialProps(appCtx) {
      appCtx.ctx.store = makeStore();

      const initialProps = Child.getInitialProps
        ? await Child.getInitialProps.call(Child, appCtx)
        : {};
      const initialState = appCtx.ctx.store.getState();

      return {
        initialState,
        initialProps
      };
    }

    componentDidMount() {
      this.unsubscribe = this.store.subscribe(this.setStoreState);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    setStoreState = storeState => {
      this.setState({
        storeState
      });
    };

    render() {
      const { initialProps, ...props } = this.props as any;
      return (
        <Child
          {...props}
          {...initialProps}
          state={this.state.storeState}
          actions={this.store.actions}
        />
      );
    }
  };
}

export interface NextTwineSFC<
  State,
  Actions,
  ExtraProps = {},
  Query = QueryStringMapObject
>
  extends React.StatelessComponent<
      ExtraProps & {
        actions: Twine.Return<State, Actions>["actions"];
        state: Twine.Return<State, Actions>["state"];
      }
    > {
  getInitialProps?: (
    ctx: NextContext<Query> & { store: Twine.Return<State, Actions> }
  ) => Promise<ExtraProps>;
}
