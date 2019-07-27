import middy from "middy";
import { jsonBodyParser, httpErrorHandler, cors } from "middy/middlewares";
import {
  encodeResponse,
  validateRequestBody
} from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { isError } from "@internote/lib/errors";
import { updatePreferencesById } from "./db/queries";
import { Preferences } from "./db/models";
import { required } from "@internote/lib/validator";
import { UpdateHandler } from "@internote/lib/types";

const validator = validateRequestBody<Preferences>({
  id: [],
  colorTheme: [required],
  fontTheme: [required],
  distractionFree: [],
  voice: [],
  outlineShowing: []
});

const update: UpdateHandler<Preferences> = async (event, _ctx, callback) => {
  console.log("Init handler");
  const userId = getUserIdentityId(event);
  try {
    console.log("Attempting to update preferences", event.body);
    const preferences = await updatePreferencesById(userId, event.body);
    console.log("Preferences updated", preferences);
    return callback(null, success(preferences));
  } catch (err) {
    console.log("Handler errored", err);
    if (isError(err, "NOT_FOUND")) {
      console.log("Not found error");
      throw notFound(`Preferences for user ${userId} not found`);
    } else {
      console.log("Unknown error", err);
      throw exception(err);
    }
  }
};

export const handler = middy(update)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(
    httpErrorHandler({
      logger: process.env.NODE_ENV === "test" ? () => {} : console.error
    })
  )
  .use(cors())
  .after((handler, next) => {
    console.log(
      "Request finished, the response is",
      handler.response,
      ". The type of the response is",
      typeof handler.response
    );
    next();
  });
