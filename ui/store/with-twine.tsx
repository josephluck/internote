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
    store;

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
        this.store.state = initialState;
        console.log(
          "constructor state with existing store",
          this.store.state.notes.length
        );
      } else {
        const newStore = makeStore();
        newStore.state = initialState;
        this.store = newStore;
        console.log(
          "constructor state with new store",
          this.store.state.notes.length
        );
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

      console.log("getInitialProps initialState", initialState.notes.length);

      //
      // When navigating client side, the store state does not end up
      // in the page's props.
      //

      return {
        initialState,
        initialProps,
        store: appCtx.ctx.store
      };
    }

    componentDidMount() {
      this.store.subscribe(this.setStoreState);
    }

    setStoreState = storeState => {
      console.log("subscribed update", storeState.notes.length);
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
          store={{
            ...this.store,
            state: this.state.storeState
          }}
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
        store: Twine.Return<State, Actions>;
      }
    > {
  getInitialProps?: (
    ctx: NextContext<Query> & { store: Twine.Return<State, Actions> }
  ) => Promise<ExtraProps>;
}
