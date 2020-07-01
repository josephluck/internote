import { UpdateHandler } from "@internote/lib/lambda";
import {
  encodeResponse,
  jsonErrorHandler,
  validateRequestBody,
} from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { isArray, isString, required } from "@internote/lib/validator";
import middy from "middy";
import { cors, jsonBodyParser } from "middy/middlewares";

import { updateNoteById } from "../db";
import { UpdateNoteDTO } from "../types";

const update: UpdateHandler<UpdateNoteDTO, { noteId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const userId = getUserIdentityId(event);
  const { noteId } = event.pathParameters;
  const note = await updateNoteById(noteId, userId, event.body);
  return callback(null, success(note));
};

export const validator = validateRequestBody<UpdateNoteDTO>({
  noteId: [],
  userId: [],
  content: [required], // TODO: validate slate schema
  title: [required, isString],
  tags: [required, isArray((v) => typeof v === "string")],
  dateUpdated: [],
});

export const handler = middy(update)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
