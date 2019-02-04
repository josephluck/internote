import { Twine } from "twine-js";

type AnyModel = Twine.Model<any, any, any>;

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

export function withAsyncLoading<M extends AnyModel>(
  model: any
): WithAsyncLoadingModel<M> {
  return Object.assign({}, model, {
    state: Object.assign({}, model.state, {
      loading: Object.keys(model.effects).reduce((prev, effectKey) => {
        return Object.assign({}, prev, { [effectKey]: false });
      })
    }),
    reducers: Object.assign({}, model.reducers, {
      setLoading: (state: any, { key, loading }: any) => {
        return {
          ...state,
          loading: { ...state.loading, [key]: loading }
        };
      }
    }),
    effects: Object.keys(model.effects).reduce(
      (prev, effectKey) => {
        const originalEffect = model.effects[effectKey];
        return Object.assign({}, prev, {
          [effectKey]: (
            state: M["state"],
            actions: M["effects"],
            ...args: any[]
          ) => {
            const rtn = originalEffect(state, actions, ...args);
            if (rtn && rtn.then) {
              actions.setLoading({ key: effectKey, loading: true });
              return rtn.then((response: any) => {
                actions.setLoading({ key: effectKey, loading: false });
                return response;
              });
            } else {
              return rtn;
            }
          }
        });
      },
      {} as M["effects"]
    )
  });
}
