import HttpError from "http-errors";
import middy from "middy";
import { httpErrorHandler, cors } from "middy/middlewares";
import { encodeResponse } from "@internote/lib/middlewares";
import { success, exception, notFound } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { GetHandler } from "@internote/lib/types";
import { listNotesByUserId } from "./db/queries";
import { GetNoteDTO } from "./types";
import { decompress } from "@internote/lib/compression";

const list: GetHandler = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  try {
    const notes = await listNotesByUserId(userId);
    const decompressedNotes = await Promise.all(
      notes.map(
        async (note): Promise<GetNoteDTO> => ({
          ...note,
          content: JSON.parse(await decompress(note.content))
        })
      )
    );
    return callback(null, success(decompressedNotes));
  } catch (err) {
    if (err instanceof HttpError.NotFound) {
      throw notFound(`Notes not found`);
    } else if (err instanceof HttpError.InternalServerError) {
      throw exception("Something went wrong retrieving notes");
    } else {
      throw exception(err);
    }
  }
};

export const handler = middy(list)
  .use(encodeResponse())
  .use(httpErrorHandler())
  .use(cors());
