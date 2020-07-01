import { GetHandler } from "@internote/lib/lambda";
import { encodeResponse } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { listSnippetsByUserId } from "../db";

const list: GetHandler = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  const snippets = await listSnippetsByUserId(userId);
  return callback(null, success(snippets));
};

export const handler = middy(list)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
