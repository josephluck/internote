import HttpError from "http-errors";
import middy from "middy";
import { jsonBodyParser, cors } from "middy/middlewares";
import { encodeResponse, jsonErrorHandler } from "@internote/lib/middlewares";
import { success } from "@internote/lib/responses";
import { getUserIdentityId } from "@internote/lib/user";
import { listNotesByUserId, syncNotesByUserId } from "./db/queries";
import { UpdateHandler } from "@internote/lib/types";
import {
  required,
  isArray,
  isString,
  validateArrayItems
} from "@internote/lib/validator";
import { validateRequestBody } from "@internote/lib/middlewares";
import { SyncNotesDTO } from "./types";

const sync: UpdateHandler<SyncNotesDTO> = async (event, _ctx, callback) => {
  const userId = getUserIdentityId(event);
  const existingNotes = await listNotesByUserId(userId);
  const notesToUpdate = event.body.notes;
  const notesThatWillOverwrite = notesToUpdate.filter(noteToUpdate => {
    const existingNote = existingNotes.find(
      n => n.noteId === noteToUpdate.noteId
    );
    if (!existingNote) {
      return false; // NB: new notes that have been added
    }
    return existingNote.dateUpdated > noteToUpdate.dateUpdated;
  });
  if (notesThatWillOverwrite.length > 0 && !event.body.overwrite) {
    const message =
      notesThatWillOverwrite.length > 1
        ? `There are newer versions of ${notesThatWillOverwrite
            .map(n => n.title)
            .join(", ")} in the database`
        : `There is a newer version of ${
            notesThatWillOverwrite[0].title
          } in the database`;
    throw new HttpError.Conflict(message);
  }
  const allNotes = await syncNotesByUserId(userId, event.body.notes);
  return callback(null, success(allNotes));
};

export const validator = validateRequestBody<SyncNotesDTO>({
  notes: [
    required,
    validateArrayItems({
      noteId: [],
      userId: [],
      content: [required], // TODO: validate slate schema
      title: [required, isString],
      tags: [required, isArray(v => typeof v === "string")],
      dateUpdated: []
    })
  ],
  overwrite: []
});

export const handler = middy(sync)
  .use(jsonBodyParser())
  .use(validator)
  .use(encodeResponse())
  .use(jsonErrorHandler())
  .use(cors());
