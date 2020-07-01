import { CreateHandler } from "@internote/lib/lambda";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import middy from "middy";
import { cors, jsonBodyParser } from "middy/middlewares";
import uuid from "uuid";

import { createNote } from "../db";
import { CreateNoteDTO } from "../types";

const create: CreateHandler<CreateNoteDTO> = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  const noteId = uuid();
  const note = await createNote(noteId, userId, event.body);
  return callback(null, success(note));
};

export const handler = middy(create)
  .use(jsonBodyParser())
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
