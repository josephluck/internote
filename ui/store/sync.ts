import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0 } from ".";
import { Api } from "../api/api";

interface OwnState {
  registration: null | ServiceWorkerRegistration;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setRegistration: Twine.Reducer<OwnState, ServiceWorkerRegistration>;
}

interface OwnEffects {
  register: InternoteEffect<ServiceWorkerRegistration>;
  sync: InternoteEffect0;
}

function defaultState(): OwnState {
  return {
    registration: null
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  sync: Twine.ModelApi<State, Actions>;
}

const sleep = (duration: number) =>
  new Promise(resolve => setTimeout(resolve, duration));

export function model(_api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setRegistration: (state, registration) => ({
        ...state,
        registration
      })
    },
    effects: {
      async register(_state, actions, registration) {
        actions.sync.setRegistration(registration);
        actions.sync.sync();
      },
      async sync(state, actions) {
        if (state.sync.registration) {
          state.sync.registration.sync.register("sync-notes");
          await sleep(5000);
          actions.sync.sync();
        }
      }
    }
  };
  return withAsyncLoading(ownModel, "notes");
}
