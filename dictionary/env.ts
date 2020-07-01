import { getEnv } from "@internote/infra/env";

export const env = getEnv(
  ["OXFORD_API_ID", "OXFORD_API_KEY", "SERVICES_REGION"],
  process.env
);
export type DictionaryHandlerEnvironment = typeof env;
