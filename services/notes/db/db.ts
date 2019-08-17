import { TypeDynamo } from "type-dynamo";

export const db = new TypeDynamo({
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.REGION
});
