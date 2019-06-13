import twine, { Twine } from "twine-js";
import logger from "twine-js/lib/log";
import makeApi from "@internote/api/domains/api";
import { makeSubscriber } from "./make-subscriber";
import { isServer } from "../utilities/window";

import * as Speech from "./speech";
import * as Rest from "./rest";

type Models = Twine.Models<Speech.Namespace & Rest.Namespace>;
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

function makeModel(api: Api) {
  return {
    state: {},
    reducers: {},
    effects: {},
    models: {
      speech: Speech.model(api),
      rest: Rest.model(api)
    }
  };
}

export function makeStore() {
  const api = makeApi(process.env.API_BASE_URL);
  const loggingMiddleware =
    !isServer() && process.env.NODE_ENV !== "production" ? logger : undefined;
  const store = twine<Models["state"], Models["actions"]>(makeModel(api), [
    loggingMiddleware,
    {
      onStateChange: (state, prevState) => {
        if (state.rest.session && state.rest.session.token) {
          if (state.rest.colorTheme !== prevState.rest.colorTheme) {
            api.preferences.update(state.rest.session.token, {
              colorTheme: state.rest.colorTheme.name
            });
          }
          if (state.rest.fontTheme !== prevState.rest.fontTheme) {
            api.preferences.update(state.rest.session.token, {
              fontTheme: state.rest.fontTheme.name
            });
          }
          if (state.rest.distractionFree !== prevState.rest.distractionFree) {
            api.preferences.update(state.rest.session.token, {
              distractionFree: state.rest.distractionFree
            });
          }
          if (state.rest.voice !== prevState.rest.voice) {
            api.preferences.update(state.rest.session.token, {
              voice: state.rest.voice
            });
          }
          if (state.rest.outlineShowing !== prevState.rest.outlineShowing) {
            api.preferences.update(state.rest.session.token, {
              outlineShowing: state.rest.outlineShowing
            });
          }
        }
      }
    }
  ]);

  api.client.interceptors.response.use(
    res => res,
    err => {
      if (err && err.response) {
        store.actions.rest.handleApiError(err);
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

      store.actions.rest.setFullscreen(!!fullscreenElm);
    });
  }

  return store;
}

export type Store = Twine.Return<Models["state"], Models["actions"]>;

export const Subscribe = makeSubscriber(makeStore());
