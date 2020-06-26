import { DeleteHandler } from "@internote/lib/lambda";
import { encodeResponse } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { deleteNoteById } from "../db";

const del33t: DeleteHandler<{ noteId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const { noteId } = event.pathParameters;
  const userId = getUserIdentityId(event);
  await deleteNoteById(noteId, userId);
  return callback(null, success({}));
};

export const handler = middy(del33t)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
