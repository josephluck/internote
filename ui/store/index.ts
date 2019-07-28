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
import { AuthApi, makeAuthApi } from "../auth/api";
import { makeServicesApi, ServicesApi } from "../api/api";

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

function makeModel(api: Api, servicesApi: ServicesApi, auth: AuthApi) {
  return {
    state: {},
    reducers: {},
    effects: {},
    models: {
      speech: Speech.model(servicesApi),
      preferences: Preferences.model(servicesApi),
      auth: Auth.model(servicesApi, auth),
      dictionary: Dictionary.model(api),
      confirmation: Confirmation.model(api),
      tags: Tags.model(api),
      ui: Ui.model(api),
      notes: Notes.model(api)
    }
  };
}

export function makeStore() {
  const servicesApi = makeServicesApi({
    host: env.SERVICES_HOST,
    region: env.SERVICES_REGION
  });
  const api = makeApi(env.API_BASE_URL);
  const auth = makeAuthApi({
    region: env.SERVICES_REGION,
    userPoolId: env.COGNITO_USER_POOL_ID,
    userPoolClientId: env.COGNITO_USER_POOL_CLIENT_ID,
    identityPoolId: env.COGNITO_IDENTITY_POOL_ID
  });
  const loggingMiddleware =
    !isServer() && process.env.NODE_ENV !== "production" ? logger : undefined;
  const store = twine<Models["state"], Models["actions"]>(
    makeModel(api, servicesApi, auth),
    [
      loggingMiddleware,
      {
        onStateChange: (state, prevState) => {
          const { session: session } = state.auth;
          const token = session ? session.accessToken : "";

          if (session && token) {
            if (
              state.preferences.colorTheme !== prevState.preferences.colorTheme
            ) {
              servicesApi.preferences.update(state.auth.session, {
                colorTheme: state.preferences.colorTheme.name
              });
            }
            if (
              state.preferences.fontTheme !== prevState.preferences.fontTheme
            ) {
              servicesApi.preferences.update(state.auth.session, {
                fontTheme: state.preferences.fontTheme.name
              });
            }
            if (
              state.preferences.distractionFree !==
              prevState.preferences.distractionFree
            ) {
              servicesApi.preferences.update(state.auth.session, {
                distractionFree: state.preferences.distractionFree
              });
            }
            if (state.preferences.voice !== prevState.preferences.voice) {
              servicesApi.preferences.update(state.auth.session, {
                voice: state.preferences.voice
              });
            }
            if (
              state.preferences.outlineShowing !==
              prevState.preferences.outlineShowing
            ) {
              servicesApi.preferences.update(state.auth.session, {
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
