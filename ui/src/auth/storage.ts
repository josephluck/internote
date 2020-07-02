export const defaultSession: Session = {
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

const allSessionValuesPresent = (session: Session): boolean =>
  Object.keys(defaultSession).reduce(
    // @ts-ignore
    (prev: boolean, key) => prev && Boolean(session[key]),
    true as boolean
  );

// TODO: also validate expiry
export const validateSession = (session: Session): boolean => {
  const allKeysPresent =
    Object.keys(defaultSession).length === Object.keys(session).length;
  return allKeysPresent && allSessionValuesPresent(session);
};

export const makeAuthStorage = () => {
  function storeItem<K extends keyof Session>(
    key: K,
    value: Session[K]
  ): Session[K] {
    window.localStorage.setItem(key, value.toString());
    return value;
  }

  function removeItem<K extends keyof Session>(key: K) {
    window.localStorage.removeItem(key);
  }

  function getItem<K extends keyof Session>(key: K): Session[K] {
    const item = window.localStorage.get(key);
    return typeof defaultSession[key] === "number" ? parseInt(item) : item;
  }

  function storeSession(session: Partial<Session>) {
    return Object.keys(session).map((key) => {
      // @ts-ignore
      storeItem(key, session[key]);
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
        // @ts-ignore
        [key]: getItem(key) || defaultSession[key],
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
};

export type AuthStorage = ReturnType<typeof makeAuthStorage>;

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
