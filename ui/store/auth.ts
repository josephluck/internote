import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Api, InternoteEffect, InternoteEffect0 } from ".";
import * as Types from "@internote/api/domains/types";
import { isServer } from "../utilities/window";
import cookie from "../utilities/cookie";
import { colorThemes, fontThemes } from "../theming/themes";
import Router from "next/router";
import { AuthApi, makeAuthStorage, AuthSession } from "../auth/api";

const cookies = cookie();

interface SignInSession {
  email: string;
  session: string;
}

interface OwnState {
  session: Types.Session | null;
  needsVerify: boolean;
  authSession: AuthSession | null;
  signInSession: SignInSession;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSession: Twine.Reducer<OwnState, Types.Session>;
  setAuthSession: Twine.Reducer<OwnState, AuthSession>;
  setNeedsVerify: Twine.Reducer<OwnState, boolean>;
  setSignInSession: Twine.Reducer<OwnState, SignInSession>;
}

interface OwnEffects {
  init: InternoteEffect0<void>;
  signUp: InternoteEffect<Types.SignupRequest, Promise<void>>;
  storeSession: InternoteEffect<Types.Session>;
  session: InternoteEffect<{ token: string }, Promise<void>>;
  authenticate: InternoteEffect<Types.LoginRequest, Promise<void>>;
  signUp2: InternoteEffect<{ email: string }, Promise<void>>;
  signIn2: InternoteEffect<{ email: string }, Promise<void>>;
  verify: InternoteEffect<{ code: string }, Promise<void>>;
  getAndSetCredentials: InternoteEffect0<Promise<void>>;
  signOut: InternoteEffect0;
  signOutConfirmation: InternoteEffect0;
  deleteAccount: InternoteEffect0<Promise<void>>;
  deleteAccountConfirmation: InternoteEffect0;
}

function defaultState(): OwnState {
  return {
    session: null,
    needsVerify: false,
    authSession: null,
    signInSession: { email: "", session: "" }
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

export function model(api: Api, auth: AuthApi): Model {
  const authStorage = makeAuthStorage();

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
      },
      setNeedsVerify: (state, needsVerify) => ({ ...state, needsVerify }),
      setAuthSession: (state, authSession) => ({ ...state, authSession }),
      setSignInSession: (state, signInSession) => ({ ...state, signInSession })
    },
    effects: {
      init(_state, actions) {
        // TODO: refresh token
        actions.auth.setAuthSession(authStorage.getSession());
      },
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
      async signUp2(_state, actions, payload) {
        try {
          await auth.signUp(payload.email);
          await actions.auth.signIn2(payload);
        } catch (err) {
          if (err && err.code && err.code === "UsernameExistsException") {
            return await actions.auth.signIn2(payload);
          }
          return err;
        }
      },
      async signIn2(_state, actions, { email }) {
        const response = await auth.signIn(email);
        actions.auth.setSignInSession({
          email: email,
          session: response.Session
        });
        actions.auth.setNeedsVerify(true);
      },
      async verify(state, actions, payload) {
        const credentials = await auth.respondToAuthChallenge(
          state.auth.signInSession.email,
          payload.code,
          state.auth.signInSession.session
        );
        authStorage.storeSession({
          accessToken: credentials.AuthenticationResult.AccessToken,
          expires: credentials.AuthenticationResult.ExpiresIn,
          idToken: credentials.AuthenticationResult.IdToken,
          refreshToken: credentials.AuthenticationResult.RefreshToken
        });
        actions.auth.setAuthSession(authStorage.getSession());
        await actions.auth.getAndSetCredentials();
        // Router.push("/");
        actions.auth.setNeedsVerify(false);
      },
      async getAndSetCredentials(_state, actions) {
        const session = authStorage.getSession();
        const response = await auth.getIdentityId(session.idToken);
        const credentials = await auth.getCredentials(
          session.idToken,
          response.IdentityId
        );
        authStorage.storeSession({
          accessKeyId: credentials.Credentials.AccessKeyId,
          expiration: credentials.Credentials.Expiration,
          secretKey: credentials.Credentials.SecretKey,
          sessionToken: credentials.Credentials.SessionToken
        });
        actions.auth.setAuthSession(authStorage.getSession());
      },
      async signUp(_state, actions, payload) {
        const session = await api.auth.register(payload);
        actions.auth.storeSession(session);
        await actions.ui.navigateToFirstNote();
      },
      async session(_state, actions, { token }) {
        const session = await api.auth.session(token);
        actions.auth.storeSession(session);
      },
      async authenticate(_state, actions, payload) {
        const session = await api.auth.login(payload);
        actions.auth.storeSession(session);
        await actions.ui.navigateToFirstNote();
      },
      signOutConfirmation(_state, actions) {
        actions.confirmation.setConfirmation({
          message: `Are you sure you wish to sign out?`,
          confirmButtonText: "Sign out",
          onConfirm() {
            actions.auth.signOut();
            actions.confirmation.setConfirmation(null);
          }
        });
      },
      async signOut(_state, actions) {
        actions.notes.resetState();
        if (!isServer()) {
          Router.push("/login");
        }
      },
      deleteAccountConfirmation(_state, actions) {
        actions.confirmation.setConfirmation({
          message: `Are you sure you wish to delete your account? All of your notes will be removed!`,
          confirmButtonText: "Delete account",
          async onConfirm() {
            actions.confirmation.setConfirmationConfirmLoading(true);
            await actions.auth.deleteAccount();
            actions.confirmation.setConfirmation(null);
          }
        });
      },
      async deleteAccount(state, actions) {
        actions.notes.resetState();
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
  return withAsyncLoading(ownModel, "auth");
}
