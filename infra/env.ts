export type Stage = "dev" | "prod";

export type NodeEnvironment = "development" | "production";

/**
 * The entire possible environment for the stack
 */
export type Env = {
  ATTACHMENTS_BUCKET_NAME: string;
  COGNITO_IDENTITY_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
  STAGE: Stage;
  NODE_ENV: NodeEnvironment;
  SENTRY_AUTH_TOKEN: string;
  SENTRY_DSN: string;
  SENTRY_ORG: string;
  SENTRY_PROJECT: string;
  SERVICES_HOST: string;
  SERVICES_REGION: string;
  SPEECH_BUCKET_NAME: string;
};

/**
 * Env variables that are stored in AWS SSM
 */
export const ssmEnvKeys: (keyof Env)[] = [
  "ATTACHMENTS_BUCKET_NAME",
  "COGNITO_IDENTITY_POOL_ID",
  "COGNITO_USER_POOL_CLIENT_ID",
  "COGNITO_USER_POOL_ID",
  "SENTRY_AUTH_TOKEN",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SERVICES_HOST",
  "SERVICES_REGION",
  "SPEECH_BUCKET_NAME",
  "STAGE",
];

/**
 * Env variables that should be kept secret (not exposed publicly)
 */
export const secretEnvKeys: (keyof Env)[] = ["SENTRY_AUTH_TOKEN"];

/**
 * Validates and returns a type-safe environment object from the given keys
 * and environment e.g:
 *
 * getEnv(["STAGE", "SERVICES_REGION"], process.env)
 */
export const getEnv = <K extends keyof Env>(
  keys: K[],
  env: unknown
): { [P in typeof keys[number]]: Env[P] } => {
  keys.forEach((key) => {
    if (!env[key]) {
      throw new Error(`Missing ${key} from env`);
    }
  });
  return keys.reduce((acc, key) => ({ ...acc, [key]: env[key] }), {}) as any;
};

/** TODO: deprecate and use getEnv directly */
export const validateProcessEnv = (keys: (keyof Env)[]) =>
  getEnv(keys, process.env);
