type Environment = "production" | "development";

export type Env = {
  ATTACHMENTS_BUCKET_NAME: string;
  COGNITO_IDENTITY_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
  ENVIRONMENT: Environment;
  NODE_ENV: Environment;
  SENTRY_AUTH_TOKEN: string;
  SENTRY_DSN: string;
  SENTRY_ORG: string;
  SENTRY_PROJECT: string;
  SERVICES_HOST: string;
  SERVICES_REGION: string;
  SPEECH_BUCKET_NAME: string;
};

declare global {
  interface Window {
    __ENV__: Env;
  }
}

export const isServer = typeof window === "undefined";

export const isBrowser = !isServer;

export const env: Env = isBrowser
  ? window.__ENV__
  : ((process.env as any) as Env);

/**
 * Prepares environment variables from the server and pushes them out to the
 * client. Be careful not to expose any secret environment variables here.
 */
export const prepareClientExposedEnv = (): Env =>
  isServer
    ? clientExposedEnvKeys.reduce(
        (acc, key) => ({ ...acc, [key]: process.env[key] || "" }),
        {} as Env
      )
    : ({} as Env);

/**
 * An array of environment variable names to expose to the client-side app.
 * Note you should consider these keys to be public, as they'll be available in
 * the browser. Don't include anything sensitive here.
 */
const clientExposedEnvKeys: (keyof Env)[] = [
  "ENVIRONMENT",
  "NODE_ENV",
  "ATTACHMENTS_BUCKET_NAME",
  "COGNITO_IDENTITY_POOL_ID",
  "COGNITO_USER_POOL_CLIENT_ID",
  "COGNITO_USER_POOL_ID",
  "SERVICES_HOST",
  "SERVICES_REGION",
  "SPEECH_BUCKET_NAME",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
];

export const isDevelopment = (): boolean => env.ENVIRONMENT !== "production";
