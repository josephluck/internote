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
  return callback(null, success(notes));
};

export const handler = middy(list)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
