export type Stage = "prod" | "dev" | "cdk-test";

export const allStages: Stage[] = ["prod", "dev", "cdk-test"];

export type NodeEnvironment = "development" | "production";

export type EnvConfig = {
  /**
   * The name of the state of the deployment
   */
  STAGE: {
    public: true;
    generated: true;
    type: Stage;
  };
  /**
   * Used to package appropriately
   */
  // NODE_ENV: {
  //   public: true;
  //   generated: true;
  //   type: NodeEnvironment;
  // };

  /**
   * Sentry auth token
   */
  SENTRY_AUTH_TOKEN: {
    public: false;
    generated: false;
    type: string;
  };
  /**
   * Sentry DSN
   */
  SENTRY_DSN: {
    public: true;
    generated: false;
    type: string;
  };
  /**
   * Sentry organisation
   */
  SENTRY_ORG: {
    public: true;
    generated: false;
    type: string;
  };
  /**
   * Sentry project
   */
  SENTRY_PROJECT: {
    public: true;
    generated: false;
    type: string;
  };

  /**
   * The API gateway domain. Includes `https://` and the trailing `/`
   *
   * e.g. `https://services.internote.app/` or
   * e.g. `https://elrgi28lcj.execute-api.eu-west-1.amazonaws.com/prod/`
   *
   * Note that the front-end removes the leading `https://` and trailing `/` as
   * part of the AWS4 signing process.
   */
  SERVICES_HOST: {
    public: true;
    generated: true;
    type: string;
  };
  /**
   * The AWS region the deployment resides in
   */
  SERVICES_REGION: {
    public: true;
    generated: false;
    type: string;
  };
  /**
   * The e-mail address that Internote sends emails from.
   */
  SES_FROM_ADDRESS: {
    public: false;
    generated: true;
    type: string;
  };

  /**
   * The cognito identity pool ID
   */
  COGNITO_IDENTITY_POOL_ID: {
    public: true;
    generated: true;
    type: string;
  };
  /**
   * The user pool client id
   */
  COGNITO_USER_POOL_CLIENT_ID: {
    public: true;
    generated: true;
    type: string;
  };
  /**
   * The user pool id
   */
  COGNITO_USER_POOL_ID: {
    public: true;
    generated: true;
    type: string;
  };

  /**
   * The name of the S3 bucket that files are uploaded to
   */
  // ATTACHMENTS_BUCKET_NAME: {
  //   public: true;
  //   generated: true;
  //   type: string;
  // };

  /**
   * The name of the S3 bucket that generated speech files are stored in to
   */
  SPEECH_BUCKET_NAME: {
    public: true;
    generated: true;
    type: string;
  };

  /**
   * The name of the preferences dynamo table
   */
  PREFERENCES_TABLE_NAME: {
    public: false;
    generated: true;
    type: string;
  };
  /**
   * The partition key of the preferences table
   */
  PREFERENCES_TABLE_PARTITION_KEY: {
    public: false;
    generated: true;
    type: "id";
  };

  /**
   * The name of the notes dynamo table
   */
  NOTES_TABLE_NAME: {
    public: false;
    generated: true;
    type: string;
  };
  /**
   * The partition key of the notes table
   */
  NOTES_TABLE_PARTITION_KEY: {
    public: false;
    generated: true;
    type: "noteId";
  };
  /**
   * The sort key of the notes table
   */
  NOTES_TABLE_SORT_KEY: {
    public: false;
    generated: true;
    type: "userId";
  };
  /**
   * The name of the userId -> noteId index (used to query notes for a user)
   */
  NOTES_TABLE_USER_ID_INDEX: {
    public: false;
    generated: true;
    type: string;
  };

  /**
   * The name of the notes dynamo table
   */
  SNIPPETS_TABLE_NAME: {
    public: false;
    generated: true;
    type: string;
  };
  /**
   * The partition key of the notes table
   */
  SNIPPETS_TABLE_PARTITION_KEY: {
    public: false;
    generated: true;
    type: "snippetId";
  };
  /**
   * The sort key of the notes table
   */
  SNIPPETS_TABLE_SORT_KEY: {
    public: false;
    generated: true;
    type: "userId";
  };
  /**
   * The name of the userId -> noteId index (used to query notes for a user)
   */
  SNIPPETS_TABLE_USER_ID_INDEX: {
    public: false;
    generated: true;
    type: string;
  };

  /**
   * The oxford API id
   */
  OXFORD_API_ID: {
    public: false;
    generated: false;
    type: string;
  };
  /**
   * The oxford API key
   */
  OXFORD_API_KEY: {
    public: false;
    generated: false;
    type: string;
  };

  /**
   * The name of the S3 bucket exported notes are stored in
   */
  EXPORT_BUCKET_NAME: {
    public: true;
    generated: true;
    type: string;
  };
};

export type Env = { [K in keyof EnvConfig]: EnvConfig[K]["type"] };

/**
 * The publicly available environment (available in the browser)
 */
export type PublicEnv = PickEnvPublic<true>;
export type PublicEnvKeys = PickNonNeverKeys<PublicEnv>;
export const publicEnvKeys: PublicEnvKeys[] = [
  // "ATTACHMENTS_BUCKET_NAME",
  "COGNITO_IDENTITY_POOL_ID",
  "COGNITO_USER_POOL_CLIENT_ID",
  "COGNITO_USER_POOL_ID",
  "EXPORT_BUCKET_NAME",
  // "NODE_ENV",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SERVICES_HOST",
  "SERVICES_REGION",
  "SPEECH_BUCKET_NAME",
  "STAGE",
];

/**
 * The private environment (secrets that should not be shared)
 */
export type PrivateEnv = PickEnvPublic<false>;
export type PrivateEnvKeys = PickNonNeverKeys<PrivateEnv>;
export const privateEnvKeys: PrivateEnvKeys[] = [
  "OXFORD_API_KEY",
  "OXFORD_API_ID",
  "SENTRY_AUTH_TOKEN",
];

/**
 * The environment that is generated through CDK
 */
export type GeneratedEnv = PickEnvGenerated<true>;
export type GeneratedEnvKeys = PickNonNeverKeys<GeneratedEnv>;

/**
 * The environment that is managed manually through AWS SSM
 */
export type ManualEnv = PickEnvGenerated<false>;
export type ManualEnvKeys = PickNonNeverKeys<ManualEnv>;
export const manualEnvKeys: ManualEnvKeys[] = [
  "OXFORD_API_ID",
  "OXFORD_API_KEY",
  "SENTRY_AUTH_TOKEN",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SERVICES_REGION",
];

type ExcludeRecordNevers<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
};

type PickNonNeverKeys<T> = ExcludeRecordNevers<T>[keyof T];

/**
 * Validates and returns a type-safe environment object from the given keys
 * and environment e.g:
 *
 * getEnv(["STAGE", "SERVICES_REGION"], process.env)
 */
export const getEnv = <K extends keyof Env>(
  keys: K[],
  env: any
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

type EnvKeys = keyof EnvConfig;

/**
 * A type constructor that picks a sub type based on the truthiness of the
 * public property
 */
type PickEnvPublic<T extends boolean> = {
  [K in EnvKeys]: EnvConfig[K]["public"] extends T
    ? EnvConfig[K]["type"]
    : never;
};

/**
 * A type constructor that picks a sub type based on the truthiness of the
 * generated property
 */
type PickEnvGenerated<T extends boolean> = {
  [K in EnvKeys]: EnvConfig[K]["generated"] extends T
    ? EnvConfig[K]["type"]
    : never;
};
