import { TypeDynamo } from "type-dynamo";

import { env } from "../env";

export const db = new TypeDynamo({
  endpoint: env.DYNAMO_ENDPOINT,
  region: env.SERVICES_REGION,
});
