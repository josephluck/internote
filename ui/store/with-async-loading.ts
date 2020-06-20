import { Twine } from "twine-js";
import { GlobalState } from ".";

type AnyModel = Twine.Model<any, any, any>;

// TODO: pluck out actions that return a promise here
// since these are the only ones that have loading properties
interface WithAsyncLoadingState<M extends AnyModel> {
  loading: Record<keyof M["effects"], boolean>;
}

interface WithAsyncLoadingReducers<M extends AnyModel> {
  setLoading: Twine.Reducer<
    M["state"],
    { key: keyof M["effects"]; loading: boolean }
  >;
}

export interface WithAsyncLoadingModel<M extends AnyModel> {
  state: M["state"] & WithAsyncLoadingState<M>;
  reducers: M["reducers"] & WithAsyncLoadingReducers<M>;
  effects: M["effects"];
}

export function withAsyncLoading<
  M extends AnyModel,
  K extends keyof GlobalState
>(model: any, namespace: K): WithAsyncLoadingModel<M> {
  return Object.assign({}, model, {
    state: Object.assign({}, model.state, {
      loading: Object.keys(model.effects).reduce((prev, effectKey) => {
        return {
          ...prev,
          [effectKey]: false,
        };
      }, {}),
    }),
    reducers: Object.assign({}, model.reducers, {
      setLoading: (state: any, { key, loading }: any) => {
        return {
          ...state,
          loading: { ...state.loading, [key]: loading },
        };
      },
    }),
    effects: Object.keys(model.effects).reduce((prev, effectKey) => {
      const originalEffect = model.effects[effectKey];
      return Object.assign({}, prev, {
        [effectKey]: (
          state: M["state"],
          actions: M["effects"],
          ...args: any[]
        ) => {
          const rtn = originalEffect(state, actions, ...args);
          if (rtn && rtn.then) {
            actions[namespace].setLoading({ key: effectKey, loading: true });
            return rtn
              .then((response: any) => {
                actions[namespace].setLoading({
                  key: effectKey,
                  loading: false,
                });
                return response;
              })
              .catch((err) => {
                actions[namespace].setLoading({
                  key: effectKey,
                  loading: false,
                });
                throw err;
              });
          } else {
            return rtn;
          }
        },
      });
    }, {} as M["effects"]),
  });
}
