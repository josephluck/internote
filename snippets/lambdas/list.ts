import { GetHandler } from "@internote/lib/lambda";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";

import { listSnippetsByUserId } from "../db";

const list: GetHandler = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  const snippets = await listSnippetsByUserId(userId);
  return callback(null, success(snippets));
};

export const handler = middy(list)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
