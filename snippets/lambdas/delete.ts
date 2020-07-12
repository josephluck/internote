import { DeleteHandler } from "@internote/lib/lambda";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";

import { deleteSnippetById } from "../db";

const del33t: DeleteHandler<{ snippetId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const { snippetId } = event.pathParameters;
  const userId = getUserIdentityId(event);
  await deleteSnippetById(snippetId, userId);
  return callback(null, success({}));
};

export const handler = middy(del33t)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
