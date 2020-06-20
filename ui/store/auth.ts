import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0, makeSetter } from ".";
import { isServer } from "../utilities/window";
import Router from "next/router";
import { AuthApi } from "../auth/api";
import { Session, makeAuthStorage } from "../auth/storage";
import { Api } from "../api/api";

interface SignInSession {
  email: string;
  session: string;
}

interface OwnState {
  needsVerify: boolean;
  session: Session | null;
  signInSession: SignInSession;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSession: Twine.Reducer<OwnState, Partial<Session>>;
  setNeedsVerify: Twine.Reducer<OwnState, boolean>;
  setSignInSession: Twine.Reducer<OwnState, SignInSession>;
}

interface OwnEffects {
  signUp: InternoteEffect<{ email: string }, Promise<void>>;
  signIn: InternoteEffect<{ email: string }, Promise<void>>;
  verify: InternoteEffect<{ code: string }, Promise<void>>;
  getAndSetCredentials: InternoteEffect0<Promise<void>>;
  scheduleRefresh: InternoteEffect0;
  refreshToken: InternoteEffect<string, Promise<void>>;
  signOut: InternoteEffect0;
  signOutConfirmation: InternoteEffect0;
  deleteAccount: InternoteEffect0<Promise<void>>;
  deleteAccountConfirmation: InternoteEffect0;
}

function defaultState(): OwnState {
  return {
    needsVerify: false,
    session: null,
    signInSession: { email: "", session: "" },
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  auth: Twine.ModelApi<State, Actions>;
}

const setter = makeSetter<OwnState>();

export function model(_api: Api, auth: AuthApi): Model {
  let authInterval: number = null;
  const authStorage = makeAuthStorage();

  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setNeedsVerify: setter("needsVerify"),
      setSession: (state, session) => {
        const latestSession = { ...state.session, ...session };
        authStorage.storeSession(latestSession);
        return {
          ...state,
          session: latestSession,
        };
      },
      setSignInSession: setter("signInSession"),
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
          session: response.Session,
        });
        actions.auth.setNeedsVerify(true);
      },
      async verify(state, actions, payload) {
        const credentials = await auth.respondToAuthChallenge(
          state.auth.signInSession.email,
          payload.code,
          state.auth.signInSession.session
        );
        actions.auth.setSession({
          accessToken: credentials.AuthenticationResult.AccessToken,
          expires: credentials.AuthenticationResult.ExpiresIn,
          idToken: credentials.AuthenticationResult.IdToken,
          refreshToken: credentials.AuthenticationResult.RefreshToken,
        });
        await actions.auth.getAndSetCredentials();
        Router.push("/");
        actions.auth.setNeedsVerify(false);
      },
      async getAndSetCredentials(state, actions) {
        const response = await auth.getIdentityId(state.auth.session.idToken);
        const credentials = await auth.getCredentials(
          state.auth.session.idToken,
          response.IdentityId
        );
        const session: Session = {
          ...state.auth.session,
          identityId: response.IdentityId,
          accessKeyId: credentials.Credentials.AccessKeyId,
          expiration: credentials.Credentials.Expiration,
          secretKey: credentials.Credentials.SecretKey,
          sessionToken: credentials.Credentials.SessionToken,
        };
        actions.auth.setSession(session);
        actions.preferences.get();
        actions.auth.scheduleRefresh();
      },
      scheduleRefresh(state, actions) {
        if (
          !isServer() &&
          !authInterval &&
          state.auth.session &&
          state.auth.session.refreshToken
        ) {
          const ms45mins = 2.7e6;
          authInterval = setInterval(() => {
            actions.auth.refreshToken(state.auth.session.refreshToken);
          }, ms45mins);
        }
      },
      async refreshToken(state, actions, refreshToken) {
        const credentials = await auth.refreshSession(refreshToken);
        actions.auth.setSession({
          ...state.auth.session,
          refreshToken,
          accessToken: credentials.AuthenticationResult.AccessToken,
          expires: credentials.AuthenticationResult.ExpiresIn,
          idToken: credentials.AuthenticationResult.IdToken,
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
          },
        });
      },
      async signOut(_state, actions) {
        authStorage.removeSession();
        actions.preferences.resetState();
        actions.auth.resetState();
        actions.notes.resetState();
        clearInterval(authInterval);
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
          },
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
    },
  };
  return withAsyncLoading(ownModel, "auth");
}
