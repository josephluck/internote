import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { ensureJSONBody } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { find } from "./db/queries";

export const handler = middy(async (_event, context, callback) => {
  const preferences = find(context.identity.cognitoIdentityId);
  return success(preferences, callback);
})
  .use(ensureJSONBody())
  .use(httpErrorHandler())
  .use(cors());
