import { GetHandler } from "@internote/lib/lambda";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";

import { listNotesByUserId } from "../db";

const list: GetHandler = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  const notes = await listNotesByUserId(userId);
  return callback(null, success(notes));
};

export const handler = middy(list)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
