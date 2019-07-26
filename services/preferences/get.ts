import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { ensureJSONResponse } from "@internote/lib/middlewares";
import { success, exception } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { isError } from "@internote/lib/errors";
import { find, create } from "./db/queries";

export const handler = middy(async (event, _context, callback) => {
  try {
    const preferences = await find(getUserIdentityId(event));
    return success(preferences, callback);
  } catch (err) {
    if (isError(err, "NOT_FOUND")) {
      const preferences = await create(getUserIdentityId(event));
      return success(preferences, callback);
    } else {
      return exception(err, callback);
    }
  }
})
  .use(ensureJSONResponse())
  .use(httpErrorHandler())
  .use(cors());
