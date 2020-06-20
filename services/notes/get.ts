import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { encodeResponse } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { GetHandler } from "@internote/lib/lambda";
import { findNoteById } from "./db/queries";

const get: GetHandler<{ noteId: string }> = async (event, _ctx, callback) => {
  const { noteId } = event.pathParameters;
  const userId = getUserIdentityId(event);
  const note = await findNoteById(noteId, userId);
  return callback(null, success(note));
};

export const handler = middy(get)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
