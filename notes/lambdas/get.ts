import { GetHandler } from "@internote/lib/lambda";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";

import { findNoteById } from "../db";

const get: GetHandler<{ noteId: string }> = async (event, _ctx, callback) => {
  const { noteId } = event.pathParameters;
  const userId = getUserIdentityId(event);
  const note = await findNoteById(noteId, userId);
  return callback(null, success(note));
};

export const handler = middy(get)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
