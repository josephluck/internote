export type Stage = "prod" | "dev" | "cdk-experiment" | "cdk-test";

export type NodeEnvironment = "development" | "production";

/**
 * The entire possible environment for the stack
 */
export type Env = {
  // Misc
  STAGE: Stage;
  NODE_ENV: NodeEnvironment;

  // Sentry
  SENTRY_AUTH_TOKEN: string;
  SENTRY_DSN: string;
  SENTRY_ORG: string;
  SENTRY_PROJECT: string;

  /**
   * All services
   */

  /**
   * The API gateway domain. Includes `https://` and the trailing `/`
   *
   * e.g. `https://services.internote.app/` or
   * e.g. `https://elrgi28lcj.execute-api.eu-west-1.amazonaws.com/prod/`
   *
   * Note that the front-end removes the leading `https://` and trailing `/` as
   * part of the AWS4 signing process.
   */
  SERVICES_HOST: string;
  SERVICES_REGION: string;
  DYNAMO_ENDPOINT: string;
  SES_FROM_ADDRESS: string;

  // Authentication
  COGNITO_IDENTITY_POOL_ID: string;
  COGNITO_USER_POOL_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;

  // Attachments
  ATTACHMENTS_BUCKET_NAME: string;

  // Speech
  SPEECH_BUCKET_NAME: string;

  // Preferences
  PREFERENCES_TABLE_NAME: string;
  PREFERENCES_TABLE_PARTITION_KEY: "id";

  // Notes
  NOTES_TABLE_NAME: string;
  NOTES_TABLE_PARTITION_KEY: "noteId"; // TODO: make typesafe with model?
  NOTES_TABLE_SORT_KEY: "userId";
  NOTES_TABLE_USER_ID_INDEX: string;

  // Snippets
  SNIPPETS_TABLE_NAME: string;
  SNIPPETS_TABLE_PARTITION_KEY: "snippetId";
  SNIPPETS_TABLE_SORT_KEY: "userId";
  SNIPPETS_TABLE_USER_ID_INDEX: string;

  // Dictionary
  OXFORD_API_ID: string;
  OXFORD_API_KEY: string;

  // Export
  EXPORT_BUCKET_NAME: string;
};

/**
 * Env variables that are stored in AWS SSM
 * TODO: update these with all exported keys
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
