import HttpError from "http-errors";
import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { updateNoteById, findNoteById } from "./db/queries";
import { UpdateHandler } from "@internote/lib/types";
import { required, isArray, isString } from "@internote/lib/validator";
import { validateRequestBody } from "@internote/lib/middlewares";
import { UpdateNoteDTO } from "./types";

const update: UpdateHandler<UpdateNoteDTO, { noteId: string }> = async (
  event,
  _ctx,
  callback
) => {
  const userId = getUserIdentityId(event);
  const { noteId } = event.pathParameters;
  const existingNote = await findNoteById(noteId, userId);
  if (
    !event.body.overwrite &&
    existingNote.dateUpdated &&
    event.body.dateUpdated &&
    existingNote.dateUpdated > event.body.dateUpdated
  ) {
    throw new HttpError.Conflict(
      `There is a newer version of note ${noteId} in the database`
    );
  }
  const note = await updateNoteById(noteId, userId, event.body);
  return callback(null, success(note));
};

export const validator = validateRequestBody<UpdateNoteDTO>({
  noteId: [],
  userId: [],
  content: [required], // TODO: validate slate schema
  title: [required, isString],
  tags: [required, isArray(v => typeof v === "string")],
  dateCreated: [],
  dateUpdated: [],
  overwrite: []
});

export const handler = middy(update)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
