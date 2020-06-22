import { UpdateHandler } from "@internote/lib/lambda";
import {
  encodeResponse,
  jsonErrorHandler,
  validateRequestBody,
} from "@internote/lib/middlewares";
import { exception, notFound, success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import HttpError from "http-errors";
import middy from "middy";
import { cors, jsonBodyParser } from "middy/middlewares";

import { Preferences } from "./db/models";
import { updatePreferencesById } from "./db/queries";

const validator = validateRequestBody<Preferences>({
  id: [],
  colorTheme: [],
  fontTheme: [],
  distractionFree: [],
  voice: [],
  outlineShowing: [],
});

const update: UpdateHandler<Preferences> = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  try {
    const preferences = await updatePreferencesById(userId, event.body);
    return callback(null, success(preferences));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      throw notFound(`Preferences for user ${userId} not found`);
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(update)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
