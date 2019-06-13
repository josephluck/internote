import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Api, InternoteEffect } from ".";
import * as Types from "@internote/api/domains/types";

interface OwnState {
  dictionaryShowing: boolean;
  dictionaryResults: Types.DictionaryResult[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setDictionaryResults: Twine.Reducer<OwnState, Types.DictionaryResult[]>;
  setDictionaryShowing: Twine.Reducer<OwnState, boolean>;
}

interface OwnEffects {
  requestDictionary: InternoteEffect<string>;
}

function defaultState(): OwnState {
  return {
    dictionaryShowing: false,
    dictionaryResults: []
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  dictionary: Twine.ModelApi<State, Actions>;
}

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setDictionaryShowing: (state, dictionaryShowing) => ({
        ...state,
        dictionaryShowing,
        dictionaryResults: dictionaryShowing ? state.dictionaryResults : []
      }),
      setDictionaryResults: (state, dictionaryResults) => ({
        ...state,
        dictionaryResults
      })
    },
    effects: {
      async requestDictionary(state, actions, word) {
        actions.dictionary.setDictionaryShowing(true);
        const response = await api.dictionary.lookup(state.auth.session.token, {
          word
        });
        response.map(({ results }) =>
          actions.dictionary.setDictionaryResults(results)
        );
      }
    }
  };
  return withAsyncLoading(ownModel);
}
