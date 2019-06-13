import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Api, InternoteEffect, InternoteEffect0 } from ".";
import * as Types from "@internote/api/domains/types";
import { isServer } from "../utilities/window";
import cookie from "../utilities/cookie";
import { colorThemes, fontThemes } from "../theming/themes";
import Router from "next/router";

const cookies = cookie();

interface OwnState {
  session: Types.Session | null;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSession: Twine.Reducer<OwnState, Types.Session>;
}

interface OwnEffects {
  signUp: InternoteEffect<Types.SignupRequest, Promise<void>>;
  storeSession: InternoteEffect<Types.Session>;
  session: InternoteEffect<{ token: string }, Promise<void>>;
  authenticate: InternoteEffect<Types.LoginRequest, Promise<void>>;
  signOut: InternoteEffect0;
  signOutConfirmation: InternoteEffect0;
  deleteAccount: InternoteEffect0<Promise<void>>;
  deleteAccountConfirmation: InternoteEffect0;
}

function defaultState(): OwnState {
  return {
    session: null
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  auth: Twine.ModelApi<State, Actions>;
}

function getColorThemeFromPreferences(
  preferences: Types.Preferences | undefined
) {
  return preferences
    ? colorThemes.find(theme => theme.name === preferences.colorTheme) ||
        colorThemes[0]
    : colorThemes[0];
}
function getFontThemeFromPreferences(
  preferences: Types.Preferences | undefined
) {
  return preferences
    ? fontThemes.find(theme => theme.name === preferences.fontTheme) ||
        fontThemes[0]
    : fontThemes[0];
}

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setSession(state, session) {
        if (session) {
          cookies.persistAuthToken(session.token);
        } else if (process.env.NODE_ENV === "production") {
          // NB: checking for production solves logging out from
          // hot-module reloading this file since state isn't
          // persisted between hot-module reloads
          cookies.removeAuthToken();
        }
        return {
          ...state,
          session
        };
      }
    },
    effects: {
      storeSession(_state, actions, session) {
        actions.auth.setSession(session);
        actions.preferences.setPreferences({
          colorTheme: getColorThemeFromPreferences(session.user.preferences),
          fontTheme: getFontThemeFromPreferences(session.user.preferences),
          outlineShowing:
            !!session.user.preferences &&
            session.user.preferences.outlineShowing === true,
          distractionFree:
            !!session.user.preferences &&
            session.user.preferences.distractionFree === true
        });
      },
      async signUp(_state, actions, payload) {
        const session = await api.auth.register(payload);
        actions.auth.storeSession(session);
        await actions.rest.navigateToFirstNote();
      },
      async session(_state, actions, { token }) {
        const session = await api.auth.session(token);
        actions.auth.storeSession(session);
      },
      async authenticate(_state, actions, payload) {
        const session = await api.auth.login(payload);
        actions.auth.storeSession(session);
        await actions.rest.navigateToFirstNote();
      },
      signOutConfirmation(_state, actions) {
        actions.rest.setConfirmation({
          message: `Are you sure you wish to sign out?`,
          confirmButtonText: "Sign out",
          onConfirm() {
            actions.auth.signOut();
            actions.rest.setConfirmation(null);
          }
        });
      },
      async signOut(_state, actions) {
        actions.rest.resetState();
        if (!isServer()) {
          Router.push("/login");
        }
      },
      deleteAccountConfirmation(_state, actions) {
        actions.rest.setConfirmation({
          message: `Are you sure you wish to delete your account? All of your notes will be removed!`,
          confirmButtonText: "Delete account",
          async onConfirm() {
            actions.rest.setConfirmationConfirmLoading(true);
            await actions.auth.deleteAccount();
            actions.rest.setConfirmation(null);
          }
        });
      },
      async deleteAccount(state, actions) {
        actions.rest.resetState();
        await api.user.deleteById(
          state.auth.session.token,
          state.auth.session.user.id
        );
        if (!isServer()) {
          Router.push("/register");
        }
      }
    }
  };
  return withAsyncLoading(ownModel);
}
