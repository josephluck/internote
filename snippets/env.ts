import { getEnv } from "@internote/infra/env";

export const env = getEnv(
  [
    "SNIPPETS_TABLE_NAME",
    "SNIPPETS_TABLE_PARTITION_KEY",
    "SNIPPETS_TABLE_SORT_KEY",
    "SNIPPETS_TABLE_USER_ID_INDEX",
    "DYNAMO_ENDPOINT",
    "SERVICES_REGION",
  ],
  process.env
);

export type SnippetsEnv = typeof env;
