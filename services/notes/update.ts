import HttpError from "http-errors";
import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import {
  encodeResponse,
  validateRequestBody,
  jsonErrorHandler
} from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { updateNoteById } from "./db/queries";
import { Note } from "./db/models";
import { UpdateHandler } from "@internote/lib/types";

const validator = validateRequestBody<Note>({
  noteId: [],
  userId: []
});

const update: UpdateHandler<Note, { noteId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const userId = getUserIdentityId(event);
  const { noteId } = event.pathParameters;
  try {
    const note = await updateNoteById(noteId, userId, event.body);
    return callback(null, success(note));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      throw notFound(`Note ${noteId} not found`);
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(update)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
