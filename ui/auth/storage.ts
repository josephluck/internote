import { isServer } from "../utilities/window";
import CookieFactory, { CookieSetOptions } from "universal-cookie";

const days30InMs = 2.592e9;

function makeExpiryDate(adjustmentInMs: number) {
  return new Date(Date.now() + adjustmentInMs);
}

export function cookieOptions(): CookieSetOptions {
  return {
    path: "/",
    expires: makeExpiryDate(days30InMs)
  };
}

export function makeAuthStorage(
  /**
   * The cookie (for server-side requests)
   */
  cookie?: string
) {
  const cookies = isServer() ? new CookieFactory(cookie) : new CookieFactory();

  function storeItem<K extends keyof AuthSession>(
    key: K,
    value: AuthSession[K]
  ): AuthSession[K] {
    cookies.set(key, value, cookieOptions());
    return value;
  }

  function removeItem<K extends keyof AuthSession>(key: K) {
    cookies.remove(key, cookieOptions());
  }

  function getItem<K extends keyof AuthSession>(key: K): AuthSession[K] {
    return cookies.get(key);
  }

  function storeSession(session: Partial<AuthSession>) {
    return Object.keys(session).map(key => {
      storeItem(key as keyof AuthSession, session[key]);
    });
  }

  function getSession(): AuthSession {
    const defaultSession: AuthSession = {
      accessToken: "",
      expires: 0,
      idToken: "",
      refreshToken: "",
      accessKeyId: "",
      expiration: 0,
      secretKey: "",
      sessionToken: ""
    };

    return Object.keys(defaultSession).reduce(
      (prev, key) => ({
        ...prev,
        [key]: cookies.get(key) || defaultSession[key]
      }),
      {} as AuthSession
    );
  }

  return {
    storeItem,
    getItem,
    removeItem,
    storeSession,
    getSession
  };
}

export interface AuthSession {
  /**
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  accessToken: string;
  /**
   * The length of time that the session token is valid for
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  expires: number;
  /**
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  idToken: string;
  /**
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  refreshToken: string;
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   */
  accessKeyId: string;
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   */
  expiration: number;
  /**
   * The timestamp in ms since the epoch that the session token expires
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   */
  secretKey: string;
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   */
  sessionToken: string;
}
