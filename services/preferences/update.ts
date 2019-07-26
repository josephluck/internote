import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import {
  ensureJSONResponse,
  validateRequestBody
} from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { isError } from "@internote/lib/errors";
import { update } from "./db/queries";
import { Preferences } from "./db/models";
import { required } from "@internote/lib/validator";

const validator = validateRequestBody<Preferences>({
  colorTheme: [required],
  fontTheme: [required]
});

export const handler = middy(async (event, _context, callback) => {
  const userId = getUserIdentityId(event);
  try {
    const preferences = await update(userId, event.body);
    return success(preferences, callback);
  } catch (err) {
    if (isError(err, "NOT_FOUND")) {
      return notFound(`Preferences for use ${userId}`, callback);
    } else {
      return exception(err, callback);
    }
  }
})
  .use(validator)
  .use(ensureJSONResponse())
  .use(httpErrorHandler())
  .use(cors());
