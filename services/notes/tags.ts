import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { encodeResponse } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { GetHandler } from "@internote/lib/lambda";
import { listNotesByUserId } from "./db/queries";

const list: GetHandler = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  const notes = await listNotesByUserId(userId);
  const allTags = notes
    .filter((note) => Boolean(note.tags) && note.tags.length > 0)
    .reduce((ts, note) => [...ts, ...note.tags], [] as string[])
    .filter(Boolean);
  const dedupedTags = allTags.length ? [...new Set(allTags)] : [];
  return callback(null, success(dedupedTags));
};

export const handler = middy(list)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
