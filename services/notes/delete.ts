import HttpError from "http-errors";
import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { encodeResponse } from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { DeleteHandler } from "@internote/lib/types";
import { deleteNoteById } from "./db/queries";

const del33t: DeleteHandler<{ noteId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const { noteId } = event.pathParameters;
  const userId = getUserIdentityId(event);
  try {
    await deleteNoteById(noteId, userId);
    return callback(null, success({}));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      throw notFound(`Note ${noteId} not found`);
    } else if (err instanceof HttpError.InternalServerError) {
      throw exception(`Something went wrong deleting note ${noteId}`);
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(del33t)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
