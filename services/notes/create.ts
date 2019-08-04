import uuid from "uuid";
import HttpError from "http-errors";
import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success, exception } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { createNote } from "./db/queries";
import { CreateHandler } from "@internote/lib/types";
import { CreateNoteDTO } from "./types";

const create: CreateHandler<CreateNoteDTO> = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  const noteId = uuid();
  try {
    const note = await createNote(noteId, userId, event.body);
    return callback(null, success(note));
  } catch (err) {
    if (err instanceof HttpError.InternalServerError) {
      throw exception("Something went wrong creating note");
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(create)
  .use(jsonBodyParser())
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
