import Axios from "axios";
import { isServer } from "../utilities/window";
import CookieFactory from "universal-cookie";

export function makeAuthApi({
  region,
  userPoolId,
  userPoolClientId,
  identityPoolId
}: {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId: string;
}) {
  const COGNITO_URL = `https://cognito-idp.${region}.amazonaws.com/`;
  const COGNITO_IDENTITY_URL = `https://cognito-identity.${region}.amazonaws.com/`;

  /**
   * Refreshes the user's session..
   *
   * A wrapper for: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
   */
  async function refreshSession(
    /**
     * The refresh token
     */
    refreshToken: string
  ): Promise<SessionWithoutRefreshToken> {
    const response = await Axios.post(
      COGNITO_URL,
      {
        ClientId: userPoolClientId,
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: refreshToken
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
        }
      }
    );
    return response.data;
  }

  /**
   * Gets the details of the current authenticated user.
   *
   * A wrapper for: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html
   */
  async function getUser(
    /**
     * The JWT for the current authenticated user
     */
    accessToken: string
  ): Promise<User> {
    const response = await Axios.post(
      COGNITO_URL,
      {
        AccessToken: accessToken
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser"
        }
      }
    );
    return response.data;
  }

  /**
   * Gets the credentials for the current authenticated user.
   * These credentials are required when making requests to
   * services such as API gateway or S3.
   *
   * A wrapper for: https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetCredentialsForIdentity.html
   */
  async function getCredentials(
    /**
     * JWT for the current authenticated user
     */
    accessToken: string,
    /**
     * The ID of the user in the identity pool (see getIdentityId)
     */
    identityId: string
  ): Promise<Credentials> {
    const response = await Axios.post(
      COGNITO_IDENTITY_URL,
      {
        Logins: {
          [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: accessToken
        },
        IdentityId: identityId
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Amz-Target": "AWSCognitoIdentityService.GetCredentialsForIdentity"
        }
      }
    );
    return response.data;
  }

  /**
   * Provides the Cognito Federated Identity Pool ID that the
   * user belongs to (given an access token).
   *
   * A wrapper for: https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetId.html
   */
  async function getIdentityId(
    /**
     * JWT for the current authenticated user
     */
    accessToken: string
  ): Promise<IdentityPoolUserIdResponse> {
    const response = await Axios.post(
      COGNITO_IDENTITY_URL,
      {
        IdentityPoolId: identityPoolId,
        Logins: {
          [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: accessToken
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Amz-Target": "AWSCognitoIdentityService.GetId"
        }
      }
    );
    return response.data;
  }

  /**
   * Responds to the authentication challenge presented
   * to the user, for example, a code e-mailed to them.
   *
   * NB: this method fully signs the user in (they have a
   * refresh token after this is successful).
   *
   * A wrapper for: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_RespondToAuthChallenge.html
   */
  async function respondToAuthChallenge(
    /**
     * The username of the user (their email address)
     */
    username: string,
    /**
     * The user's answer to the challenge
     */
    answer: string,
    /**
     * The user's session token (see signIn response)
     */
    sessionToken: string
  ): Promise<SessionWithRefreshToken> {
    const response = await Axios.post(
      COGNITO_URL,
      {
        ChallengeName: "CUSTOM_CHALLENGE",
        ChallengeResponses: {
          USERNAME: username,
          ANSWER: answer
        },
        ClientId: userPoolClientId,
        Session: sessionToken
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Amz-Target":
            "AWSCognitoIdentityProviderService.RespondToAuthChallenge"
        }
      }
    );
    return response.data;
  }

  /**
   * Signs the user in.
   *
   * A wrapper for: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
   */
  async function signIn(
    /**
     * The username of the user (their email address)
     */
    username: string
  ): Promise<Challenge> {
    const response = await Axios.post(
      COGNITO_URL,
      {
        AuthFlow: "CUSTOM_AUTH",
        ClientId: userPoolClientId,
        AuthParameters: { USERNAME: username },
        ClientMetadata: {}
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
        }
      }
    );
    return response.data;
  }

  /**
   * Signs the user up.
   *
   * A wrapper for: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html
   */
  async function signUp(
    /**
     * The username of the user (their email address)
     */
    username: string
  ): Promise<SignUpResponse> {
    const response = await Axios.post(
      COGNITO_URL,
      {
        ClientId: userPoolClientId,
        Username: username,
        Password: getRandomString(30),
        UserAttributes: [],
        ValidationData: null
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp"
        }
      }
    );
    return response.data;
  }

  return {
    refreshSession,
    getCredentials,
    getIdentityId,
    getUser,
    respondToAuthChallenge,
    signIn,
    signUp
  };
}

export function makeAuthStorage(
  /**
   * The cookie (for server-side requests)
   */
  cookie?: string
) {
  const cookies = isServer() ? new CookieFactory(cookie) : new CookieFactory();

  function storeItem<K extends keyof Storage>(
    key: K,
    value: Storage[K]
  ): Storage[K] {
    cookies.set(key, value);
    return value;
  }

  function getItem<K extends keyof Storage>(key: K): Storage[K] {
    return cookies.get(key);
  }

  function storeSession(session: Partial<Storage>) {
    return Object.keys(session).map(key => {
      cookies.set(key, session[key]);
    });
  }

  function getSession(): Storage {
    const defaultSession: Storage = {
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
      {} as Storage
    );
  }

  return {
    storeItem,
    getItem,
    storeSession,
    getSession
  };
}

function intToHex(nr: number) {
  return nr.toString(16).padStart(2, "0");
}

function getRandomString(bytes: number = 30) {
  const randomValues = new Uint8Array(bytes);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(intToHex)
    .join("");
}

interface Storage {
  /**
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  accessToken: string;
  /**
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
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   */
  secretKey: string;
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_Credentials.html
   */
  sessionToken: string;
}

interface SessionWithoutRefreshToken {
  /**
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  AuthenticationResult: {
    AccessToken: string;
    ExpiresIn: number;
    IdToken: string;
    TokenType: "Bearer";
  };
  ChallengeParameters: {};
}

interface SessionWithRefreshToken {
  /**
   * See https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AuthenticationResultType.html
   */
  AuthenticationResult: {
    AccessToken: "string";
    ExpiresIn: number;
    IdToken: "string";
    RefreshToken: "string";
    TokenType: "Bearer";
  };
  ChallengeParameters: {};
}

interface User {
  UserAttributes: UserAttribute[];
  Username: string;
}

interface UserAttribute {
  Name: "sub" | "email_verified" | "email";
  Value: string;
}

interface Credentials {
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetCredentialsForIdentity.html
   */
  Credentials: {
    AccessKeyId: string;
    Expiration: number;
    SecretKey: string;
    SessionToken: string;
  };
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetCredentialsForIdentity.html#CognitoIdentity-GetCredentialsForIdentity-response-IdentityId
   */
  IdentityId: string;
}

interface IdentityPoolUserIdResponse {
  /**
   * See https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetId.html#API_GetId_ResponseSyntax
   */
  IdentityId: string;
}

/**
 * Returned when signing in and a challenge is needed
 * i.e. a code emailed to the user.
 */
interface Challenge {
  ChallengeName: "CUSTOM_CHALLENGE";
  ChallengeParameters: {
    USERNAME: string;
    email: string;
  };
  Session: string;
}

interface SignUpResponse {
  UserConfirmed: boolean;
  UserSub: string;
}
