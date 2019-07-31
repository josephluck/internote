import HttpError from "http-errors";
import { Note, defaultNote } from "./models";
import { NotesRepository } from "./repositories";
import { isDbError } from "@internote/lib/errors";
import { match, isEqualTo } from "type-dynamo";

export const listNotesByUserId = async (userId: string) => {
  try {
    const result = await NotesRepository.find()
      .filter(match("userId", isEqualTo(userId)))
      .allResults()
      .execute();
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const findNoteById = async (noteId: string, userId: string) => {
  try {
    const result = await NotesRepository.find({
      noteId,
      userId
    }).execute();
    return result.data;
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
  updates: Partial<Note>
) => {
  try {
    const result = await NotesRepository.update(
      { noteId, userId },
      updates
    ).execute();
    return result.data;
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(`Note ${noteId} could not be found`);
    } else {
      throw err;
    }
  }
};

export const createNote = async (noteId: string, userId: string) => {
  const result = await NotesRepository.save({
    ...defaultNote,
    noteId,
    userId
  }).execute();
  return result.data;
};

export const deleteNoteById = async (noteId: string, userId: string) => {
  try {
    const result = await NotesRepository.delete({
      noteId,
      userId
    }).execute();
    return result.data;
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(`Note ${noteId} could not be found`);
    } else {
      throw err;
    }
  }
};
