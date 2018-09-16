import * as React from "react";
import { Twine } from "twine-js";

export function withTwine<S, A>(
  makeStore: () => Twine.Return<S, A>,
  Child: any
) {
  return class WithTwine extends React.Component {
    store = makeStore();

    constructor(props, context) {
      super(props, context);

      const { initialState, store } = props;
      const hasStore = store && "state" in store && "actions" in store;
      if (hasStore) {
        console.log("Has store");
        this.store = store;
      } else {
        console.log("Making new store with state", initialState);
        const newStore = makeStore();
        newStore.state = initialState;
        this.store = newStore;
      }
    }

    static async getInitialProps(appCtx) {
      appCtx.ctx.store = makeStore();
      const initialProps = Child.getInitialProps
        ? await Child.getInitialProps.call(Child, appCtx)
        : {};
      return {
        initialState: appCtx.ctx.store.getState(),
        initialProps
      };
    }

    render() {
      const { initialProps, ...props } = this.props as any;
      return <Child {...props} {...initialProps} store={this.store} />;
    }
  };
}
