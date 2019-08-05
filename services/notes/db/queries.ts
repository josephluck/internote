import HttpError from "http-errors";
import { Note } from "./models";
import { NotesRepository } from "./repositories";
import { isDbError } from "@internote/lib/errors";
import { match, isEqualTo } from "type-dynamo";
import { GetNoteDTO, UpdateNoteDTO, CreateNoteDTO } from "../types";
import { decompress, compress } from "@internote/lib/compression";
import { defaultNote } from "./default-note";

export const listNotesByUserId = async (
  userId: string
): Promise<GetNoteDTO[]> => {
  const result = await NotesRepository.find()
    .filter(match("userId", isEqualTo(userId)))
    .allResults()
    .execute();
  return await Promise.all(result.data.map(unmarshallNote));
};

export const findNoteById = async (
  noteId: string,
  userId: string
): Promise<GetNoteDTO> => {
  try {
    const result = await NotesRepository.find({
      noteId,
      userId
    }).execute();
    return await unmarshallNote(result.data);
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(`Note ${noteId} could not be found`);
    } else {
      throw err;
    }
  }
};

export const updateNoteById = async (
  noteId: string,
  userId: string,
  updates: Partial<UpdateNoteDTO>
): Promise<GetNoteDTO> => {
  try {
    const result = await NotesRepository.update({
      ...updates,
      noteId,
      userId,
      content: await compress(JSON.stringify(updates.content)),
      tags: [...new Set(updates.tags)]
    }).execute();
    return await unmarshallNote(result.data);
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(`Note ${noteId} could not be found`);
    } else {
      throw err;
    }
  }
};

export const createNote = async (
  noteId: string,
  userId: string,
  note: CreateNoteDTO
): Promise<GetNoteDTO> => {
  const result = await NotesRepository.save({
    ...defaultNote,
    ...note,
    content: await compress(JSON.stringify(defaultNote.content)),
    tags: [],
    noteId,
    userId
  }).execute();
  return await unmarshallNote(result.data);
};

export const deleteNoteById = async (
  noteId: string,
  userId: string
): Promise<void> => {
  try {
    await NotesRepository.delete({
      noteId,
      userId
    }).execute();
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(`Note ${noteId} could not be found`);
    } else {
      throw err;
    }
  }
};

/**
 * Converts a note back from the database in to
 * a DTO that the lambda can use.
 *
 * Note that the tags are converted from a dynamodb set
 * of strings in to a list of strings
 */
const unmarshallNote = async (note: Note): Promise<GetNoteDTO> => ({
  ...note,
  content: JSON.parse(await decompress(note.content)),
  tags: note.tags && note.tags.values ? (note.tags as any).values : []
});
