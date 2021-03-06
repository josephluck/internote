import { CreateHandler } from "@internote/lib/lambda";
import {
  encodeResponse,
  jsonErrorHandler,
  validateRequestBody,
} from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { isString, required } from "@internote/lib/validator";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import uuid from "uuid";

import { createSnippet } from "../db";
import { CreateSnippetDTO } from "../types";

const validator = validateRequestBody<CreateSnippetDTO>({
  title: [required, isString],
  content: [required],
});

const create: CreateHandler<CreateSnippetDTO> = async (
  event,
  _ctx,
  callback
) => {
  const userId = getUserIdentityId(event);
  const snippetId = uuid();
  const snippet = await createSnippet(snippetId, userId, event.body);
  return callback(null, success(snippet));
};

export const handler = middy(create)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(httpErrorHandler())
  .use(cors());
