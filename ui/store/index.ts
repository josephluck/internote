import twine, { Twine } from "twine-js";
// import logger from "twine-js/lib/log";
import { isServer } from "../utilities/window";

import * as Speech from "./speech";
import * as Preferences from "./preferences";
import * as Auth from "./auth";
import * as Dictionary from "./dictionary";
import * as Confirmation from "./confirmation";
import * as Tags from "./tags";
import * as Ui from "./ui";
import * as Notes from "./notes";
import * as Sync from "./sync";
import * as ExportNote from "./export-note";
import * as Snippets from "./snippets";
import { makeTwineHooks } from "./with-twine";
import { env } from "../env";
import { AuthApi, makeAuthApi } from "../auth/api";
import { makeApi, Api } from "../api/api";

type Models = Twine.Models<
  Speech.Namespace &
    Preferences.Namespace &
    Auth.Namespace &
    Dictionary.Namespace &
    Confirmation.Namespace &
    Tags.Namespace &
    Ui.Namespace &
    Notes.Namespace &
    Sync.Namespace &
    ExportNote.Namespace &
    Snippets.Namespace
>;
export type GlobalActions = Models["actions"];
export type GlobalState = Models["state"];

export type InternoteEffect<Payload, Return = void> = Twine.Effect<
  Models["state"],
  Models["actions"],
  Payload,
  Return
>;

export type InternoteEffect0<Return = void> = Twine.Effect0<
  Models["state"],
  Models["actions"],
  Return
>;

/**
 * Returns a strongly typed setter function that can be used to
 * create simple setter reducers for single keys quickly
 */
export function makeSetter<T>() {
  return function(
    key: keyof T
  ): Twine.Reducer<T, T[typeof key]>["implementation"] {
    return function(state, value) {
      return {
        ...state,
        [key]: value
      };
    };
  };
}

function makeModel(api: Api, auth: AuthApi) {
  return {
    state: {},
    reducers: {},
    effects: {},
    models: {
      speech: Speech.model(api),
      preferences: Preferences.model(api),
      auth: Auth.model(api, auth),
      dictionary: Dictionary.model(api),
      confirmation: Confirmation.model(api),
      tags: Tags.model(api),
      ui: Ui.model(api),
      notes: Notes.model(api),
      sync: Sync.model(api),
      exportNote: ExportNote.model(api),
      snippets: Snippets.model(api)
    }
  };
}

export function makeStore() {
  const api = makeApi({
    host: env.SERVICES_HOST,
    region: env.SERVICES_REGION
  });
  const auth = makeAuthApi({
    region: env.SERVICES_REGION,
    userPoolId: env.COGNITO_USER_POOL_ID,
    userPoolClientId: env.COGNITO_USER_POOL_CLIENT_ID,
    identityPoolId: env.COGNITO_IDENTITY_POOL_ID
  });
  // const loggingMiddleware =
  //   !isServer() && process.env.NODE_ENV !== "production" ? logger : undefined;
  const store = twine<Models["state"], Models["actions"]>(
    makeModel(api, auth),
    [
      // loggingMiddleware,
      {
        onStateChange: (state, prevState) => {
          const { session } = state.auth;
          const token = session ? session.accessToken : "";

          if (session && token) {
            if (
              state.preferences.colorTheme !== prevState.preferences.colorTheme
            ) {
              api.preferences.update(state.auth.session, {
                colorTheme: state.preferences.colorTheme.name
              });
            }
            if (
              state.preferences.fontTheme !== prevState.preferences.fontTheme
            ) {
              api.preferences.update(state.auth.session, {
                fontTheme: state.preferences.fontTheme.name
              });
            }
            if (
              state.preferences.distractionFree !==
              prevState.preferences.distractionFree
            ) {
              api.preferences.update(state.auth.session, {
                distractionFree: state.preferences.distractionFree
              });
            }
            if (state.preferences.voice !== prevState.preferences.voice) {
              api.preferences.update(state.auth.session, {
                voice: state.preferences.voice
              });
            }
            if (
              state.preferences.outlineShowing !==
              prevState.preferences.outlineShowing
            ) {
              api.preferences.update(state.auth.session, {
                outlineShowing: state.preferences.outlineShowing
              });
            }
            if (
              state.preferences.offlineSync !==
              prevState.preferences.offlineSync
            ) {
              api.preferences.update(state.auth.session, {
                offlineSync: state.preferences.offlineSync
              });
            }
          }
        }
      }
    ]
  );

  /** NB: required to refresh tokens if they are near expiry before API requests */
  api.setStore(store);

  if (!isServer()) {
    document.addEventListener("fullscreenchange", () => {
      const doc = document as any;

      const fullscreenElm: HTMLElement | null =
        doc.fullscreenElement ||
        doc.mozFullScreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement;

      store.actions.ui.setFullscreen(!!fullscreenElm);
    });
  }

  return store;
}

export type Store = Twine.Return<Models["state"], Models["actions"]>;

export const { useTwineState, useTwineActions, injectTwine } = makeTwineHooks(
  makeStore
);
