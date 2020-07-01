import { getEnv } from "@internote/infra/env";

export const env = getEnv(
  ["EXPORT_BUCKET_NAME", "SERVICES_REGION"],
  process.env
);
export type ExportHandlerEnvironment = typeof env;
