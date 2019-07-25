import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0 } from ".";
import { isServer } from "../utilities/window";
import Router from "next/router";
import { AuthApi } from "../auth/api";
import { AuthSession, makeAuthStorage } from "../auth/storage";
import { ServicesApi } from "../api/api";

interface SignInSession {
  email: string;
  session: string;
}

interface OwnState {
  needsVerify: boolean;
  authSession: AuthSession | null;
  signInSession: SignInSession;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setAuthSession: Twine.Reducer<OwnState, Partial<AuthSession>>;
  setNeedsVerify: Twine.Reducer<OwnState, boolean>;
  setSignInSession: Twine.Reducer<OwnState, SignInSession>;
}

interface OwnEffects {
  signUp: InternoteEffect<{ email: string }, Promise<void>>;
  signIn: InternoteEffect<{ email: string }, Promise<void>>;
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

export function model(api: ServicesApi, auth: AuthApi): Model {
  const authStorage = makeAuthStorage();

  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => {
        return defaultState();
      },
      setNeedsVerify: (state, needsVerify) => ({ ...state, needsVerify }),
      setAuthSession: (state, authSession) => {
        const latestSession = { ...state.authSession, ...authSession };
        authStorage.storeSession(latestSession);
        return {
          ...state,
          authSession: latestSession
        };
      },
      setSignInSession: (state, signInSession) => ({ ...state, signInSession })
    },
    effects: {
      async signUp(_state, actions, payload) {
        try {
          await auth.signUp(payload.email);
          await actions.auth.signIn(payload);
        } catch (err) {
          if (err && err.code && err.code === "UsernameExistsException") {
            return await actions.auth.signIn(payload);
          }
          return err;
        }
      },
      async signIn(_state, actions, { email }) {
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
        actions.auth.setAuthSession({
          accessToken: credentials.AuthenticationResult.AccessToken,
          expires: credentials.AuthenticationResult.ExpiresIn,
          idToken: credentials.AuthenticationResult.IdToken,
          refreshToken: credentials.AuthenticationResult.RefreshToken
        });
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
        actions.auth.setAuthSession({
          ...state.auth.authSession,
          accessKeyId: credentials.Credentials.AccessKeyId,
          expiration: credentials.Credentials.Expiration,
          secretKey: credentials.Credentials.SecretKey,
          sessionToken: credentials.Credentials.SessionToken
        });
        await actions.preferences.get();
        // TODO: set up interval for calling calling this repeatedly
        // when user is using the app (since the tokens are short-lived)
      },
      async refreshToken(state, actions, refreshToken) {
        const credentials = await auth.refreshSession(refreshToken);
        actions.auth.setAuthSession({
          ...state.auth.authSession,
          refreshToken,
          accessToken: credentials.AuthenticationResult.AccessToken,
          expires: credentials.AuthenticationResult.ExpiresIn,
          idToken: credentials.AuthenticationResult.IdToken
        });
        await actions.auth.getAndSetCredentials();
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
          Router.push("/authenticate");
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
      async deleteAccount(_state, actions) {
        actions.notes.resetState();
        // TODO - API stuff for this
        // await api.user.deleteById(
        //   state.auth.authSession,
        //   state.auth.session.user.id
        // );
        actions.auth.signOut();
      },
      async testAuthentication(state, actions) {
        const response = await api.health.authenticated(state.auth.authSession);
        console.log(response);
        await actions.preferences.get();
      }
    }
  };
  return withAsyncLoading(ownModel, "auth");
}
