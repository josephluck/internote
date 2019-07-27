import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { encodeResponse } from "@internote/lib/middlewares";
import { success, exception } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { isError } from "@internote/lib/errors";
import { GetHandler } from "@internote/lib/types";
import { findPreferencesById, createPreferences } from "./db/queries";

const get: GetHandler = async (event, _ctx, callback) => {
  console.log("Getting preferences");
  try {
    const preferences = await findPreferencesById(getUserIdentityId(event));
    return callback(null, success(preferences));
  } catch (err) {
    if (isError(err, "NOT_FOUND")) {
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
