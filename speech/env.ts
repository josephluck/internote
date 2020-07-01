import { getEnv } from "@internote/infra/env";

export const env = getEnv(
  ["SPEECH_BUCKET_NAME", "SERVICES_REGION"],
  process.env
);
export type SpeechHandlerEnvironment = typeof env;
