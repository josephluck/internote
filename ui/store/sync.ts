import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect0, InternoteEffect } from ".";
import { Api } from "../api/api";
import { makeAuthDbInterface } from "../service-worker/db";
import { isServer } from "../utilities/window";

interface OwnState {
  isPolling: boolean;
  registration: null | ServiceWorkerRegistration;
  interval: number;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setIsPolling: Twine.Reducer<OwnState, boolean>;
  setRegistration: Twine.Reducer<OwnState, ServiceWorkerRegistration>;
  setInterval: Twine.Reducer<OwnState, number>;
}

interface OwnEffects {
  register: InternoteEffect0;
  unregister: InternoteEffect0;
  setOfflineSync: InternoteEffect<boolean>;
  startPolling: InternoteEffect0;
  stopPolling: InternoteEffect0;
  sync: InternoteEffect0;
  storeSession: InternoteEffect0<Promise<void>>;
}

function defaultState(): OwnState {
  return {
    isPolling: false,
    registration: null,
    interval: -1
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  sync: Twine.ModelApi<State, Actions>;
}

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
      }),
      setInterval: (state, timer) => ({
        ...state,
        interval: timer
      })
    },
    effects: {
      async register(_state, actions) {
        return new Promise(async resolve => {
          if (!isServer() && navigator && navigator.serviceWorker) {
            try {
              await navigator.serviceWorker.register("/service-worker.js", {
                scope: "/"
              });
              const registration = await navigator.serviceWorker.ready;
              console.log("[SW] [APP] Registered");
              actions.sync.setRegistration(registration);
              actions.sync.startPolling();
              resolve();
            } catch (err) {
              console.log(`[SW] [APP] Registration failed: ${err}`);
            }
          } else {
            return Promise.resolve();
          }
        });
      },
      async unregister(_state, actions) {
        if (!isServer() && navigator && navigator.serviceWorker) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => registration.unregister())
          );
          actions.sync.setRegistration(null);
          console.log("[SW] [APP] Unregistered");
        }
      },
      async setOfflineSync(_state, actions, on) {
        actions.preferences.setOfflineSync(on);
        if (on) {
          await actions.sync.register();
        } else {
          await actions.sync.unregister();
        }
      },
      async startPolling(state, actions) {
        if (
          !isServer() &&
          state.sync.interval === -1 &&
          state.sync.registration
        ) {
          actions.sync.setInterval(setInterval(actions.sync.sync, 10000));
          console.log("[SW] [APP] Started polling");
        }
      },
      async stopPolling(state, actions) {
        if (!isServer() && state.sync.interval > -1) {
          clearInterval(state.sync.interval);
          actions.sync.setInterval(-1);
          console.log("[SW] [APP] Stopped polling");
        }
      },
      async sync(state, actions) {
        if (state.sync.registration && state.auth.session) {
          console.log("[SW] [APP] Sync started");
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
