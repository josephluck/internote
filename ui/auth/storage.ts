import { isServer } from "../utilities/window";
import CookieFactory, { CookieSetOptions } from "universal-cookie";

const days30InMs = 2.592e9;

function makeExpiryDate(adjustmentInMs: number) {
  return new Date(Date.now() + adjustmentInMs);
}

const defaultSession: Session = {
  idToken: "",
  accessToken: "",
  expires: 0,
  refreshToken: "",
  accessKeyId: "",
  expiration: 0,
  secretKey: "",
  sessionToken: "",
  identityId: "",
};

export function cookieOptions(): CookieSetOptions {
  return {
    path: "/",
    expires: makeExpiryDate(days30InMs),
  };
}

export function makeAuthStorage(
  /**
   * The cookie (for server-side requests)
   */
  cookie?: string
) {
  const cookies = isServer() ? new CookieFactory(cookie) : new CookieFactory();

  function storeItem<K extends keyof Session>(
    key: K,
    value: Session[K]
  ): Session[K] {
    cookies.set(key, value, cookieOptions());
    return value;
  }

  function removeItem<K extends keyof Session>(key: K) {
    cookies.remove(key, cookieOptions());
  }

  function getItem<K extends keyof Session>(key: K): Session[K] {
    return cookies.get(key);
  }

  function storeSession(session: Partial<Session>) {
    return Object.keys(session).map((key) => {
      storeItem(key as keyof Session, session[key]);
    });
  }

  function removeSession() {
    return Object.keys(defaultSession).map((key) => {
      removeItem(key as keyof Session);
    });
  }

  function getSession(): Session {
    return Object.keys(defaultSession).reduce(
      (prev, key) => ({
        ...prev,
        [key]: cookies.get(key) || defaultSession[key],
      }),
      {} as Session
    );
  }

  return {
    storeItem,
    getItem,
    removeItem,
    storeSession,
    getSession,
    removeSession,
  };
}

export interface Session {
  /**
   * Unique for each user
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  idToken: string;
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
  refreshToken: string;
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   */
  accessKeyId: string;
  /**
   * The time at which the token will session expire
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   * Note that expiration is in seconds (not milliseconds) since epoch
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
  /**
   * The Cognito Federated Identity Pool ID that the user belongs to.
   */
  identityId: string;
}
