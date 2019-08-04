import HttpError from "http-errors";
import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { encodeResponse } from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { GetHandler } from "@internote/lib/types";
import { listNotesByUserId } from "./db/queries";

const list: GetHandler = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  try {
    const notes = await listNotesByUserId(userId);
    const allTags = notes.reduce(
      (ts, note) => [...ts, ...note.tags],
      [] as string[]
    );
    const dedupedTags = [...new Set(allTags)];
    return callback(null, success(dedupedTags));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      throw notFound(`Tags not found`);
    } else if (err instanceof HttpError.InternalServerError) {
      throw exception("Something went wrong retrieving tags");
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(list)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
