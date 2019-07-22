import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Api, InternoteEffect, InternoteEffect0 } from ".";
import * as Types from "@internote/api/domains/types";
import { isServer } from "../utilities/window";
import cookie from "../utilities/cookie";
import { colorThemes, fontThemes } from "../theming/themes";
import Router from "next/router";
import { AuthApi } from "../auth/api";
import { env } from "../env";
import Axios from "axios";
import { AuthSession, makeAuthStorage } from "../auth/storage";
import aws4 from "aws4";

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
  setAuthSession: Twine.Reducer<OwnState, Partial<AuthSession>>;
  setNeedsVerify: Twine.Reducer<OwnState, boolean>;
  setSignInSession: Twine.Reducer<OwnState, SignInSession>;
}

interface OwnEffects {
  signUp: InternoteEffect<Types.SignupRequest, Promise<void>>;
  storeSession: InternoteEffect<Types.Session>;
  session: InternoteEffect<{ token: string }, Promise<void>>;
  authenticate: InternoteEffect<Types.LoginRequest, Promise<void>>;
  signUp2: InternoteEffect<{ email: string }, Promise<void>>;
  signIn2: InternoteEffect<{ email: string }, Promise<void>>;
  verify: InternoteEffect<{ code: string }, Promise<void>>;
  getAndSetCredentials: InternoteEffect0<Promise<void>>;
  refreshToken: InternoteEffect<string, Promise<void>>;
  signOut: InternoteEffect0;
  signOutConfirmation: InternoteEffect0;
  deleteAccount: InternoteEffect0<Promise<void>>;
  deleteAccountConfirmation: InternoteEffect0;
  testAuthentication: InternoteEffect0;
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
      setAuthSession: (state, authSession) => ({
        ...state,
        authSession: { ...state.authSession, ...authSession }
      }),
      setSignInSession: (state, signInSession) => ({ ...state, signInSession })
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
      async getAndSetCredentials(state, actions) {
        const response = await auth.getIdentityId(
          state.auth.authSession.idToken
        );
        const credentials = await auth.getCredentials(
          state.auth.authSession.idToken,
          response.IdentityId
        );
        const session = {
          ...state.auth.authSession,
          accessKeyId: credentials.Credentials.AccessKeyId,
          expiration: credentials.Credentials.Expiration,
          secretKey: credentials.Credentials.SecretKey,
          sessionToken: credentials.Credentials.SessionToken
        };
        authStorage.storeSession(session);
        actions.auth.setAuthSession(session);
        // TODO: set up interval for calling calling this repeatedly
        // when user is using the app (since the tokens are short-lived)
      },
      async refreshToken(state, actions, refreshToken) {
        const credentials = await auth.refreshSession(refreshToken);
        const session = {
          ...state.auth.authSession,
          refreshToken,
          accessToken: credentials.AuthenticationResult.AccessToken,
          expires: credentials.AuthenticationResult.ExpiresIn,
          idToken: credentials.AuthenticationResult.IdToken
        };
        authStorage.storeSession(session);
        actions.auth.setAuthSession(session);
        await actions.auth.getAndSetCredentials();
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
      },
      async testAuthentication(state) {
        const request = aws4.sign(
          {
            host: "dev-services.internote.app",
            path: "/authenticated",
            url: "https://dev-services.internote.app/authenticated",
            method: "GET",
            region: env.SERVICES_REGION,
            service: "execute-api"
          },
          {
            accessKeyId: state.auth.authSession.accessKeyId,
            secretAccessKey: state.auth.authSession.secretKey,
            sessionToken: state.auth.authSession.sessionToken
          }
        );
        console.log({ request });
        delete request.headers["Host"];
        delete request.headers["Content-Length"];
        const response = await Axios(request);
        console.log(response.data);
      }
    }
  };
  return withAsyncLoading(ownModel, "auth");
}
