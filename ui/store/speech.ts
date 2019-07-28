import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect } from ".";
import { ServicesApi } from "../api/api";

interface OwnState {
  speechSrc: string | null;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSpeechSrc: Twine.Reducer<OwnState, string | null>;
}

interface OwnEffects {
  requestSpeech: InternoteEffect<{ words: string; id: string }>;
}

function defaultState(): OwnState {
  return {
    speechSrc: null
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  speech: Twine.ModelApi<State, Actions>;
}

export function model(api: ServicesApi): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setSpeechSrc: (state, speechSrc) => ({
        ...state,
        speechSrc
      })
    },
    effects: {
      async requestSpeech(state, actions, { words, id }) {
        const result = await api.speech.create(state.auth.session, {
          id,
          words,
          voice: state.preferences.voice || "Joey"
        });
        result.map(response => actions.speech.setSpeechSrc(response.src));
      }
    }
  };
  return withAsyncLoading(ownModel, "speech");
}
