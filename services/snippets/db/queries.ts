import { isDbError } from "@internote/lib/errors";
import HttpError from "http-errors";
import { isEqualTo, match } from "type-dynamo";

import { CreateSnippetDTO, GetSnippetDTO } from "../types";
import { SnippetsRepository } from "./repositories";

export const listSnippetsByUserId = async (
  userId: string
): Promise<GetSnippetDTO[]> => {
  const result = await SnippetsRepository.find()
    .filter(match("userId", isEqualTo(userId)))
    .allResults()
    .execute();
  return await Promise.all(result.data);
};
export const createSnippet = async (
  snippetId: string,
  userId: string,
  body: CreateSnippetDTO
): Promise<GetSnippetDTO> => {
  const result = await SnippetsRepository.save({
    title: body.title,
    content: body.content,
    snippetId,
    userId,
  }).execute();
  return await result.data;
};

export const deleteSnippetById = async (
  snippetId: string,
  userId: string
): Promise<void> => {
  try {
    await SnippetsRepository.delete({
      snippetId,
      userId,
    }).execute();
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(`Snippet ${snippetId} could not be found`);
    } else {
      throw err;
    }
  }
};
