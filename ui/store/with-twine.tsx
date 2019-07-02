import * as React from "react";
import { Twine } from "twine-js";
import { NextContext } from "next";
import { DefaultQuery } from "next/router";

const STORE_KEY = "__TWINE_STORE__";

function isServer() {
  return typeof window === "undefined";
}

function initStore<Store extends Twine.Return<any, any>>(
  makeStore: () => Store
): Store {
  if (isServer()) {
    return makeStore();
  } else if (window[STORE_KEY]) {
    return window[STORE_KEY];
  } else {
    window[STORE_KEY] = makeStore();
    return window[STORE_KEY];
  }
}

export function makeTwineHooks<Store extends Twine.Return<any, any>>(
  makeStore: () => Store
) {
  const TwineContext = React.createContext<Store>(makeStore());

  function useTwine<
    S extends (state: Store["state"]) => any,
    A extends (actions: Store["actions"]) => any
  >(mapStoreToState: S, mapStoreToActions: A) {
    const store = React.useContext(TwineContext);
    const [state, setState] = React.useState(() =>
      mapStoreToState(store.state)
    );
    const [actions] = React.useState(() => mapStoreToActions(store.actions));
    React.useEffect(() => {
      return store.subscribe(state => {
        setState(mapStoreToState(state));
      });
    }, []);
    return [state, actions];
  }

  function injectTwine(Child: any) {
    return class WithTwine extends React.Component {
      store: Store;

      constructor(props, context) {
        super(props, context);

        const { initialState, store } = props;
        const validStore =
          store &&
          "state" in store &&
          "actions" in store &&
          "subscribe" in store &&
          "getState" in store;

        if (validStore) {
          this.store = store;
          this.store.replaceState(initialState);
          this.store = { ...this.store, state: this.store.getState() };
        } else {
          const newStore = initStore(makeStore);
          newStore.replaceState(initialState);
          this.store = { ...newStore, state: newStore.getState() };
        }
      }

      static async getInitialProps(app) {
        const store = initStore<Store>(makeStore);
        app.ctx.store = { ...store, state: store.getState() };

        const initialProps = Child.getInitialProps
          ? await Child.getInitialProps.call(Child, app)
          : {};
        const initialState = app.ctx.store.getState();

        return {
          initialState,
          initialProps,
          store: { ...app.ctx.store, state: initialState }
        };
      }

      render() {
        const { initialProps, initialState, ...props } = this.props as any;
        const store = { ...this.store, state: initialState };
        return (
          <TwineContext.Provider value={store}>
            <Child {...props} {...initialProps} store={store} />
          </TwineContext.Provider>
        );
      }
    };
  }

  return {
    useTwine,
    injectTwine
  };
}

export interface NextTwineSFC<
  Store extends Twine.Return<any, any>,
  ExtraProps = {},
  Query extends DefaultQuery = DefaultQuery
>
  extends React.StatelessComponent<
    ExtraProps & {
      store: Store;
    }
  > {
  getInitialProps?: (
    ctx: NextContext<Query> & { store: Store }
  ) => Promise<ExtraProps>;
}
