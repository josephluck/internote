import { GetHandler } from "@internote/lib/lambda";
import { encodeResponse } from "@internote/lib/middlewares";
import { exception, success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import HttpError from "http-errors";
import middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { createPreferences, findPreferencesById } from "./db/queries";

const get: GetHandler = async (event, _ctx, callback) => {
  try {
    const preferences = await findPreferencesById(getUserIdentityId(event));
    return callback(null, success(preferences));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      const preferences = await createPreferences(getUserIdentityId(event));
      return callback(null, success(preferences));
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(get)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
