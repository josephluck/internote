import HttpError from "http-errors";
import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { encodeResponse } from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { GetHandler } from "@internote/lib/types";
import { findNoteById } from "./db/queries";

const get: GetHandler<{ noteId: string }> = async (event, _ctx, callback) => {
  const { noteId } = event.pathParameters;
  const userId = getUserIdentityId(event);
  try {
    const note = await findNoteById(noteId, userId);
    return callback(null, success(note));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      throw notFound(`Note ${noteId} not found`);
    } else if (err instanceof HttpError.InternalServerError) {
      throw exception(`Something went wrong retrieving note ${noteId}`);
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(get)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
