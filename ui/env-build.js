const ssmEnvKeys = [
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

const nextEnvKeys = ssmEnvKeys;

const envKeys = [...ssmEnvKeys, "NODE_ENV"];

const nextEnv = nextEnvKeys.reduce(
  (acc, key) => ({ ...acc, [key]: process.env[key] }),
  {}
);

const validateEnv = (keys, env) =>
  keys.forEach((key) => {
    if (!env[key]) {
      throw new Error(`Missing ${key} from env`);
    }
  });

const validateProcessEnv = (keys) =>
  keys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing ${key} from process.env`);
    }
  });

module.exports = {
  ssmEnvKeys,
  nextEnvKeys,
  envKeys,
  nextEnv,
  validateEnv,
  validateProcessEnv,
};
