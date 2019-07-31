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
import { UpdateHandler } from "@internote/lib/types";
import { required } from "@internote/lib/validator";
import { NoteDTO } from "./types";
import { Note } from "./db/models";
import { compress } from "./compression";

const validator = validateRequestBody<NoteDTO>({
  noteId: [],
  userId: [],
  content: [required],
  tags: [required]
});

const update: UpdateHandler<NoteDTO, { noteId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const userId = getUserIdentityId(event);
  const { noteId } = event.pathParameters;
  try {
    const content = await compress(JSON.stringify(event.body.content));
    const update: Note = {
      ...event.body,
      noteId,
      userId,
      content
    };
    const note = await updateNoteById(noteId, userId, update);
    return callback(null, success(note));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      throw notFound(`Note ${noteId} not found`);
    } else if (err instanceof HttpError.InternalServerError) {
      throw exception(`Something went wrong saving note ${noteId}`);
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
