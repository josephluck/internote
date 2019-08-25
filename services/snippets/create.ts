import uuid from "uuid";
import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { createSnippet } from "./db/queries";
import { CreateHandler } from "@internote/lib/types";
import { CreateSnippetDTO } from "./types";

// TODO: validation

const create: CreateHandler<CreateSnippetDTO> = async (
  event,
  _ctx,
  callback
) => {
  const userId = getUserIdentityId(event);
  const noteId = uuid();
  const note = await createSnippet(noteId, userId, event.body);
  return callback(null, success(note));
};

export const handler = middy(create)
  .use(jsonBodyParser())
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
