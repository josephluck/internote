import { getEnv } from "@internote/infra/env";

export const env = getEnv(
  [
    "PREFERENCES_TABLE_NAME",
    "PREFERENCES_TABLE_PARTITION_KEY",
    "SERVICES_REGION",
    "DYNAMO_ENDPOINT",
  ],
  process.env
);

export type PreferencesEnv = typeof env;
