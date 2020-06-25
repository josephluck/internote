import { getEnv } from "@internote/infra/env";

export const env = getEnv(
  [
    "NOTES_TABLE_NAME",
    "NOTES_TABLE_PARTITION_KEY",
    "NOTES_TABLE_SORT_KEY",
    "DYNAMO_ENDPOINT",
    "SERVICES_REGION",
  ],
  process.env
);

export type NotesEnv = typeof env;
