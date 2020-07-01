import { compress, decompress } from "@internote/lib/compression";
import { isDbError } from "@internote/lib/errors";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import HttpError from "http-errors";

import { defaultNote } from "./default-note";
import { env } from "./env";
import { Note } from "./models";
import { CreateNoteDTO, GetNoteDTO, UpdateNoteDTO } from "./types";

const client = new DocumentClient();

export const listNotesByUserId = async (
  userId: string
): Promise<GetNoteDTO[]> => {
  const result = await client
    .query({
      TableName: env.NOTES_TABLE_NAME,
      IndexName: env.NOTES_TABLE_USER_ID_INDEX,
      KeyConditionExpression: "userId = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userId,
      },
    })
    .promise();
  if (!result.Items) {
    throw new HttpError.InternalServerError("Request for notes list failed");
  }
  return await Promise.all(result.Items.map(unmarshallNote));
};

export const findNoteById = async (
  noteId: string,
  userId: string
): Promise<GetNoteDTO> => {
  try {
    const result = await client
      .get({
        TableName: env.NOTES_TABLE_NAME,
        Key: {
          [env.NOTES_TABLE_PARTITION_KEY]: noteId,
          [env.NOTES_TABLE_SORT_KEY]: userId,
        },
      })
      .promise();
    if (!result.Item) {
      throw new HttpError.NotFound(`Note ${noteId} could not be found`);
    }
    return result.Item as GetNoteDTO;
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
  { title, tags, content }: Partial<UpdateNoteDTO>
): Promise<GetNoteDTO> => {
  try {
    const existingNote = await findNoteById(noteId, userId);
    const item: UpdateNoteDTO = {
      ...existingNote,
      [env.NOTES_TABLE_PARTITION_KEY]: noteId,
      [env.NOTES_TABLE_SORT_KEY]: userId,
      title,
      content,
      tags: tags.length ? [...new Set(tags)] : [],
      dateUpdated: Date.now(),
    };
    await client
      .put({
        TableName: env.NOTES_TABLE_NAME,
        Item: {
          ...item,
          content: await compress(JSON.stringify(item.content)),
        }, // TODO: there's a type mismatch between the write model and the read model}
      })
      .promise();

    return item;
  } catch (err) {
    // TODO: handle other DB errors (like failed updates)
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
  body: CreateNoteDTO
): Promise<GetNoteDTO> => {
  const item: GetNoteDTO = {
    ...defaultNote,
    title: body.title,
    content: body.content || defaultNote.content,
    tags: body.tags || [],
    [env.NOTES_TABLE_PARTITION_KEY]: noteId,
    [env.NOTES_TABLE_SORT_KEY]: userId,
    dateCreated: Date.now(),
  };
  await client
    .put({
      TableName: env.NOTES_TABLE_NAME,
      Item: { ...item, content: await compress(JSON.stringify(item.content)) },
    })
    .promise();
  return item;
};

export const deleteNoteById = async (
  noteId: string,
  userId: string
): Promise<void> => {
  try {
    await client
      .delete({
        TableName: env.NOTES_TABLE_NAME,
        Key: {
          [env.NOTES_TABLE_PARTITION_KEY]: noteId,
          [env.NOTES_TABLE_SORT_KEY]: userId,
        },
      })
      .promise();
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
  tags: note.tags && note.tags.values ? (note.tags as any).values : [],
});
