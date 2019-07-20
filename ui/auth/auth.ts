import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import { env } from "../env";
import { isServer } from "../utilities/window";

export function makeAuth() {
  let user: any;

  Amplify.configure({
    Auth: {
      region: env.SERVICES_REGION,
      userPoolId: env.COGNITO_USER_POOL_ID,
      userPoolWebClientId: env.COGNITO_USER_POOL_CLIENT_ID,
      identityPoolId: env.COGNITO_IDENTITY_POOL_ID,
      mandatorySignIn: false,
      cookieStorage: {
        domain: isServer() ? ".internote.app" : window.location.hostname,
        path: "/",
        expires: 365,
        secure: env.LOCALHOST !== "true"
      },
      authenticationFlowType: "CUSTOM_AUTH_FLOW_ONLY"
    }
  });

  async function signUp(email: string) {
    await Auth.signUp({
      username: email,
      password: getRandomString(30)
    });
  }

  async function signIn(email: string) {
    user = await Auth.signIn(email);
  }

  async function answerCustomChallenge(answer: string) {
    await Auth.sendCustomChallengeAnswer(user, answer);
    return await isAuthenticated();
  }

  async function signOut() {
    await Auth.signOut();
  }

  async function getUser() {
    if (!user) {
      user = await Auth.currentAuthenticatedUser();
    }
    return user;
  }

  async function isAuthenticated() {
    const user = await Auth.currentAuthenticatedUser();
    return !!user;
  }

  async function getCredentials() {
    return await Auth.currentCredentials();
  }

  return {
    signUp,
    signIn,
    answerCustomChallenge,
    signOut,
    isAuthenticated,
    getUser,
    getCredentials
  };
}

function getRandomString(bytes: number = 30) {
  const randomValues = new Uint8Array(bytes);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(intToHex)
    .join("");
}

function intToHex(nr: number) {
  return nr.toString(16).padStart(2, "0");
}

export type Auth = ReturnType<typeof makeAuth>;
