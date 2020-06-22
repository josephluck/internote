import * as React from "react";
import { Twine } from "twine-js";
import { NextPageContext, NextComponentType } from "next";

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

function defaultMemoise<S extends any>(state1: S, state2: S): boolean {
  return state1 === state2;
}

export function makeTwineHooks<Store extends Twine.Return<any, any>>(
  makeStore: () => Store
) {
  const TwineContext = React.createContext<Store>(initStore(makeStore));

  // TODO: support dependencies by useEffect so that external variables can be used in mapState fn
  function useTwineState<S extends (state: Store["state"]) => any>(
    /**
     * A function that takes global store state and should return a
     * slice of state for use.
     */
    mapState: S,
    /**
     * An array of dependencies to track that, when changed, will re-run
     * mapState. Useful if mapState relies on any variables or closures
     */
    dependencies: any[] = [],
    /**
     * A function that will be called to check whether the state has changed.
     * Can be used to optimise performance to prevent unnecessary re-renders.
     *
     * If this function returns false, the state will be updated.
     *
     * NB: defaults to strict equality check
     */
    _memoiseState: (
      previousValue: ReturnType<typeof mapState>,
      nextValue: ReturnType<typeof mapState>
    ) => boolean = defaultMemoise
  ) {
    type MS = ReturnType<typeof mapState>;
    const store = React.useContext(TwineContext);
    const [state, setState] = React.useState<MS>(() => mapState(store.state));
    const stateMapper = React.useRef(mapState);
    stateMapper.current = mapState;

    React.useEffect(() => {
      setState(stateMapper.current(store.state));
      const unsubscribe = store.subscribe((storeState) => {
        const newState = stateMapper.current(storeState);
        // TODO: fix this since state is invalid
        // if (!memoiseState(state, newState)) {
        setState(newState);
        // }
      });
      return unsubscribe;
    }, dependencies);

    return state as MS;
  }

  function useTwineActions<A extends (actions: Store["actions"]) => any>(
    /**
     * A function that takes global store actions and should return a
     * slice of state for use.
     */
    mapActions: A,
    /**
     * An array of dependencies to track that, when changed, will re-run
     * mapActions. Useful if mapActions relies on any variables or closures
     */
    dependencies: any[] = []
  ) {
    const store = React.useContext(TwineContext);
    const actions = React.useMemo(
      () => (mapActions ? mapActions(store.actions) : {}),
      dependencies
    );

    return actions as ReturnType<typeof mapActions>;
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
          store: { ...app.ctx.store, state: initialState },
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
    useTwineState,
    useTwineActions,
    injectTwine,
    TwineContext,
  };
}

export type NextTwineSFC<
  Store extends Twine.Return<any, any>,
  P = {},
  IP = P
> = NextComponentType<NextPageContext & { store: Store }, P, IP>;
