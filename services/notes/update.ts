import HttpError from "http-errors";
import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { updateNoteById } from "./db/queries";
import { UpdateHandler } from "@internote/lib/types";
import { compress, decompress } from "@internote/lib/compression";
import { required, isArray } from "@internote/lib/validator";
import { validateRequestBody } from "@internote/lib/middlewares";
import { UpdateNoteDTO, GetNoteDTO } from "./types";

const update: UpdateHandler<UpdateNoteDTO, { noteId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const userId = getUserIdentityId(event);
  const { noteId } = event.pathParameters;
  try {
    const content = await compress(JSON.stringify(event.body.content));
    const updatedNote = await updateNoteById(noteId, userId, {
      ...event.body,
      noteId,
      userId,
      content,
      tags: [...new Set(event.body.tags)]
    });
    const note: GetNoteDTO = {
      ...updatedNote,
      content: JSON.parse(await decompress(updatedNote.content))
    };
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

export const validator = validateRequestBody<UpdateNoteDTO>({
  noteId: [],
  userId: [],
  content: [required], // TODO: validate slate schema
  tags: [required, isArray(v => typeof v === "string")]
});

export const handler = middy(update)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
