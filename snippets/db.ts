import { isDbError } from "@internote/lib/errors";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import HttpError from "http-errors";

import { env } from "./env";
import { CreateSnippetDTO, GetSnippetDTO } from "./types";

const client = new DocumentClient();

export const listSnippetsByUserId = async (
  userId: string
): Promise<GetSnippetDTO[]> => {
  const result = await client
    .query({
      TableName: env.SNIPPETS_TABLE_NAME,
      IndexName: env.SNIPPETS_TABLE_USER_ID_INDEX,
      KeyConditionExpression: "userId = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userId,
      },
    })
    .promise();
  if (!result.Items) {
    throw new HttpError.InternalServerError("Request for snippets list failed");
  }
  return result.Items as GetSnippetDTO[];
};

export const createSnippet = async (
  snippetId: string,
  userId: string,
  body: CreateSnippetDTO
): Promise<GetSnippetDTO> => {
  const item: GetSnippetDTO = {
    title: body.title,
    content: body.content,
    [env.SNIPPETS_TABLE_PARTITION_KEY]: snippetId,
    [env.SNIPPETS_TABLE_SORT_KEY]: userId,
  };
  await client
    .put({
      TableName: env.SNIPPETS_TABLE_NAME,
      Item: item,
    })
    .promise();
  return item;
};

export const deleteSnippetById = async (
  snippetId: string,
  userId: string
): Promise<void> => {
  try {
    await client
      .delete({
        TableName: env.SNIPPETS_TABLE_NAME,
        Key: {
          [env.SNIPPETS_TABLE_PARTITION_KEY]: snippetId,
          [env.SNIPPETS_TABLE_SORT_KEY]: userId,
        },
      })
      .promise();
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(`Snippet ${snippetId} could not be found`);
    } else {
      throw err;
    }
  }
};
