import { getEnv } from "@internote/infra/env";

export const env = getEnv(["SES_FROM_ADDRESS"], process.env);

export type AuthEnvironment = typeof env;
