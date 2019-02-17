import * as React from "react";
import { Twine } from "twine-js";
import { NextContext } from "next";
import { DefaultQuery } from "next/router";

const STORE_KEY = "__TWINE_STORE__";

function isServer() {
  return typeof window === "undefined";
}

interface State {
  storeState: any;
}

function initStore<S, A>(
  makeStore: () => Twine.Return<S, A>
): Twine.Return<S, A> {
  if (isServer()) {
    return makeStore();
  } else if (window[STORE_KEY]) {
    return window[STORE_KEY];
  } else {
    window[STORE_KEY] = makeStore();
    return window[STORE_KEY];
  }
}

export function withTwine<S, A>(
  makeStore: () => Twine.Return<S, A>,
  Child: any
) {
  return class WithTwine extends React.Component<{}, State> {
    store: Twine.Return<S, A>;

    constructor(props, context) {
      super(props, context);

      const { initialState, store } = props;
      const hasStore =
        store &&
        "state" in store &&
        "actions" in store &&
        "subscribe" in store &&
        "getState" in store;

      if (hasStore) {
        this.store = store;
        this.store.replaceState(initialState);
      } else {
        const newStore = initStore<S, A>(makeStore);
        newStore.replaceState(initialState);
        this.store = newStore;
      }
      this.state = {
        storeState: this.store.getState()
      };
    }

    static async getInitialProps(appCtx) {
      const store = initStore<S, A>(makeStore);

      appCtx.ctx.store = { ...store, state: store.getState() };

      const initialProps = Child.getInitialProps
        ? await Child.getInitialProps.call(Child, appCtx)
        : {};

      const initialState = store.getState();

      return {
        initialState,
        initialProps,
        store: appCtx.ctx.store
      };
    }

    componentDidMount() {
      this.store.subscribe(this.setStoreState);
    }

    setStoreState = state => {
      this.setState({
        storeState: state
      });
    };

    render() {
      const { initialProps, ...props } = this.props as any;
      return (
        <Child
          {...props}
          {...initialProps}
          store={{ ...this.store, state: this.state.storeState }}
        />
      );
    }
  };
}

export interface NextTwineSFC<
  State,
  Actions,
  ExtraProps = {},
  Query extends DefaultQuery = DefaultQuery
>
  extends React.StatelessComponent<
    ExtraProps & {
      store: Twine.Return<State, Actions>;
    }
  > {
  getInitialProps?: (
    ctx: NextContext<Query> & { store: Twine.Return<State, Actions> }
  ) => Promise<ExtraProps>;
}
