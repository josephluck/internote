import twine, { Twine } from "twine-js";
import logger from "twine-js/lib/log";
import makeApi from "@internote/api/domains/api";
import { isServer } from "../utilities/window";

import * as Speech from "./speech";
import * as Preferences from "./preferences";
import * as Auth from "./auth";
import * as Dictionary from "./dictionary";
import * as Confirmation from "./confirmation";
import * as Tags from "./tags";
import * as Ui from "./ui";
import * as Notes from "./notes";
import { makeTwineHooks } from "./with-twine";
import { env } from "../env";
import { makeAuth, Auth as AuthDependency } from "../auth/auth";

type Models = Twine.Models<
  Speech.Namespace &
    Preferences.Namespace &
    Auth.Namespace &
    Dictionary.Namespace &
    Confirmation.Namespace &
    Tags.Namespace &
    Ui.Namespace &
    Notes.Namespace
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

export type Api = ReturnType<typeof makeApi>;

function makeModel(api: Api, auth: AuthDependency) {
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
      notes: Notes.model(api)
    }
  };
}

export function makeStore() {
  const api = makeApi(env.API_BASE_URL);
  const auth = makeAuth();
  const loggingMiddleware =
    !isServer() && process.env.NODE_ENV !== "production" ? logger : undefined;
  const store = twine<Models["state"], Models["actions"]>(
    makeModel(api, auth),
    [
      loggingMiddleware,
      {
        onStateChange: (state, prevState) => {
          const { session } = state.auth;
          const token = session ? session.token : "";

          if (session && token) {
            if (
              state.preferences.colorTheme !== prevState.preferences.colorTheme
            ) {
              api.preferences.update(token, {
                colorTheme: state.preferences.colorTheme.name
              });
            }
            if (
              state.preferences.fontTheme !== prevState.preferences.fontTheme
            ) {
              api.preferences.update(token, {
                fontTheme: state.preferences.fontTheme.name
              });
            }
            if (
              state.preferences.distractionFree !==
              prevState.preferences.distractionFree
            ) {
              api.preferences.update(token, {
                distractionFree: state.preferences.distractionFree
              });
            }
            if (state.preferences.voice !== prevState.preferences.voice) {
              api.preferences.update(token, {
                voice: state.preferences.voice
              });
            }
            if (
              state.preferences.outlineShowing !==
              prevState.preferences.outlineShowing
            ) {
              api.preferences.update(token, {
                outlineShowing: state.preferences.outlineShowing
              });
            }
          }
        }
      }
    ]
  );

  api.client.interceptors.response.use(
    res => res,
    err => {
      if (err && err.response) {
        store.actions.ui.handleApiError(err);
      }
      return Promise.reject(err);
    }
  );

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
