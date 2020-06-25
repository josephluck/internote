export type Stage = "dev" | "prod";

export type NodeEnvironment = "development" | "production";

/**
 * The full environment for the stack
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

export const validateEnv = (keys: (keyof Env)[], env: unknown): env is Env => {
  keys.forEach((key) => {
    if (!env[key]) {
      throw new Error(`Missing ${key} from env`);
    }
  });
  return true;
};

export const validateProcessEnv = (keys: (keyof Env)[]) =>
  validateEnv(keys, process.env);
