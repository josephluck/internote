import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0 } from ".";
import { Api } from "../api/api";
import { makeAuthDbInterface } from "../service-worker/db";

interface OwnState {
  isPolling: boolean;
  registration: null | ServiceWorkerRegistration;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setIsPolling: Twine.Reducer<OwnState, boolean>;
  setRegistration: Twine.Reducer<OwnState, ServiceWorkerRegistration>;
}

interface OwnEffects {
  register: InternoteEffect<ServiceWorkerRegistration>;
  startPolling: InternoteEffect0;
  sync: InternoteEffect0;
  storeSession: InternoteEffect0<Promise<void>>;
}

function defaultState(): OwnState {
  return {
    isPolling: false,
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
  const authDb = makeAuthDbInterface();
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setIsPolling: (state, isPolling) => ({ ...state, isPolling }),
      setRegistration: (state, registration) => ({
        ...state,
        registration
      })
    },
    effects: {
      async register(state, actions, registration) {
        actions.sync.setRegistration(registration);
        if (!state.sync.isPolling) {
          actions.sync.startPolling();
        }
      },
      async startPolling(state, actions) {
        if (state.sync.registration) {
          actions.sync.sync();
          actions.sync.setIsPolling(true);
          await sleep(30000); // Sync every 30 seconds
          actions.sync.startPolling();
        }
      },
      async sync(state, actions) {
        if (state.sync.registration && state.auth.session) {
          await actions.sync.storeSession();
          actions.notes.fetchNotes();
          state.sync.registration.sync.register("sync-notes");
        }
      },
      async storeSession(state) {
        if (state.sync.registration && state.auth.session) {
          return await authDb.set(state.auth.session);
        }
        return Promise.resolve();
      }
    }
  };
  return withAsyncLoading(ownModel, "sync");
}
