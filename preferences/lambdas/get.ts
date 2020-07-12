import { GetHandler } from "@internote/lib/lambda";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { exception, success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import HttpError from "http-errors";

import { createPreferences, findPreferencesById } from "../db";

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
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
