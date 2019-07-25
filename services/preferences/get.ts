import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { Preferences } from "./types";
import { ensureJSONBody } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";

const defaultPreferences: Preferences = {
  colorTheme: "Internote",
  fontTheme: "Inter",
  distractionFree: false,
  voice: "Joey",
  outlineShowing: true
};

export const handler = middy((_event, _context, callback) => {
  return success(defaultPreferences, callback);
})
  .use(ensureJSONBody())
  .use(httpErrorHandler())
  .use(cors());
