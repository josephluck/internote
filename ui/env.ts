type Environment = "production" | "development";
type Stage = "prod" | "dev";

export type Env = {
  ATTACHMENTS_BUCKET_NAME: string;
  COGNITO_IDENTITY_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
  STAGE: Stage;
  NODE_ENV: Environment;
  SENTRY_AUTH_TOKEN: string;
  SENTRY_DSN: string;
  SENTRY_ORG: string;
  SENTRY_PROJECT: string;
  SERVICES_HOST: string;
  SERVICES_REGION: string;
  SPEECH_BUCKET_NAME: string;
};

export type ClientExposedEnv = Omit<Env, "SENTRY_AUTH_TOKEN">;

/**
 * Prepares environment variables from the server and makes them available.
 */
export const prepareServerExposedEnv = (): Env => ({
  // ATTACHMENTS_BUCKET_NAME: process.env.ATTACHMENTS_BUCKET_NAME,
  COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  NODE_ENV: process.env.NODE_ENV as Environment,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
  SERVICES_HOST: process.env.SERVICES_HOST,
  SERVICES_REGION: process.env.SERVICES_REGION,
  SPEECH_BUCKET_NAME: process.env.SPEECH_BUCKET_NAME,
  STAGE: process.env.STAGE as Stage,
});

/**
 * Prepares environment variables from the server and pushes them out to the
 * client. Be careful not to expose any secret environment variables here.
 */
export const prepareClientExposedEnv = (): ClientExposedEnv => {
  const { SENTRY_AUTH_TOKEN, ...clientExposedEnv } = prepareServerExposedEnv();
  return clientExposedEnv;
};

export const isServer = typeof window === "undefined";

export const isBrowser = !isServer;

export const env: Env = isBrowser
  ? (window.__ENV__ as Env)
  : prepareServerExposedEnv();

declare global {
  interface Window {
    __ENV__: ClientExposedEnv;
  }
}
