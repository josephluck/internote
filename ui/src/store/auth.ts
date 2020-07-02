import { api } from "../api";
import { isNearExpiry } from "../auth/api";
import {
  Session,
  defaultSession,
  makeAuthStorage,
  validateSession,
} from "../auth/storage";
import { resetState as resetNotes } from "./notes";
import { getPreferences, resetState as resetPreferences } from "./preferences";
import { store } from "./store";

const authStorage = makeAuthStorage();

type SignInSession = {
  email: string;
  session: string;
};

type AuthState = {
  needsVerify: boolean;
  session: Session;
  signInSession: SignInSession;
};

export const authInitialState: AuthState = {
  needsVerify: false,
  session: authStorage.getSession(),
  signInSession: { email: "", session: "" },
};

export const resetState = store.createMutator(
  (state) => (state.auth = authInitialState)
);

export const setNeedsVerify = store.createMutator(
  (state, needsVerify: boolean) => (state.auth.needsVerify = needsVerify)
);

export const setSession = store.createMutator(
  (state, session: Partial<Session>) => {
    const latestSession = { ...state.auth.session, ...session };
    authStorage.storeSession(latestSession);
    state.auth.session = {
      ...defaultSession,
      ...latestSession,
    };
  }
);

export const setSignInSession = store.createMutator(
  (state, signInSession: SignInSession) =>
    (state.auth.signInSession = signInSession)
);

export const initialize = store.createEffect(
  async (state, restricted: boolean) => {
    async function initAuthRequest(): Promise<any> {
      const session = authStorage.getSession();
      setSession(session);

      const tokenNearExpiry =
        session.refreshToken && isNearExpiry(session.expiration * 1000);

      const tokensMissing =
        !session.accessKeyId || !session.secretKey || !session.sessionToken;

      if (tokenNearExpiry || (session.refreshToken && tokensMissing)) {
        console.log("TODO: refresh");
        // await context.store.refreshToken(session.refreshToken);
      }

      authStorage.storeSession(session);
    }

    try {
      await initAuthRequest();

      const session = state.auth.session;
      const hasSession =
        session && session.accessToken && session.accessToken.length > 0;

      if (hasSession) {
        await actions.preferences.get();
      } else if (restricted) {
        signOut();
      }
    } catch (err) {
      if (restricted) {
        signOut();
      }
    }
  }
);

export const signUp = store.createEffect(
  async (_state, payload: { email: string }) => {
    try {
      await api.auth.signUp(payload.email);
      await signIn(payload);
    } catch (err) {
      if (err && err.code && err.code === "UsernameExistsException") {
        return await signIn(payload);
      }
      return err;
    }
  }
);

export const signIn = store.createEffect(
  async (_state, payload: { email: string }) => {
    const response = await api.auth.signIn(payload.email);
    setSignInSession({
      email: payload.email,
      session: response.Session,
    });
    setNeedsVerify(true);
  }
);

export const verify = store.createEffect(
  async (state, payload: { code: string }) => {
    const credentials = await api.auth.respondToAuthChallenge(
      state.auth.signInSession.email,
      payload.code,
      state.auth.signInSession.session
    );
    setSession({
      accessToken: credentials.AuthenticationResult.AccessToken,
      expires: credentials.AuthenticationResult.ExpiresIn,
      idToken: credentials.AuthenticationResult.IdToken,
      refreshToken: credentials.AuthenticationResult.RefreshToken,
    });
    await getAndSetCredentials();
    setNeedsVerify(false);
  }
);

export const getAndSetCredentials = store.createEffect(async (state) => {
  const response = await api.auth.getIdentityId(state.auth.session.idToken);
  const credentials = await api.auth.getCredentials(
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
  setSession(session);
  getPreferences();
  scheduleRefresh();
});

let authInterval: number | null = null;
export const scheduleRefresh = store.createEffect((state) => {
  if (!authInterval && state.auth.session && state.auth.session.refreshToken) {
    const ms45mins = 2.7e6;
    authInterval = setInterval(() => {
      if (validateSession(state.auth.session)) {
        refreshToken(state.auth.session.refreshToken);
      } else {
        signOut();
      }
    }, ms45mins);
  }
});

export const refreshToken = store.createEffect(
  async (state, refreshToken: string) => {
    const credentials = await api.auth.refreshSession(refreshToken);
    setSession({
      ...state.auth.session,
      refreshToken,
      accessToken: credentials.AuthenticationResult.AccessToken,
      expires: credentials.AuthenticationResult.ExpiresIn,
      idToken: credentials.AuthenticationResult.IdToken,
    });
    await getAndSetCredentials();
  }
);

export const signOut = store.createEffect(() => {
  authStorage.removeSession();
  resetPreferences();
  resetState();
  resetNotes();
  if (authInterval) {
    clearInterval(authInterval);
  }
});

export const deleteAccount = store.createEffect(() => {
  signOut();
  // TODO - API stuff for this
  // await api.user.deleteById(
  //   state.auth.authSession,
  //   state.auth.session.user.id
  // );
});
