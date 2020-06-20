import HttpError from "http-errors";
import { SnippetsRepository } from "./repositories";
import { isDbError } from "@internote/lib/errors";
import { match, isEqualTo } from "type-dynamo";
import { GetSnippetDTO, CreateSnippetDTO } from "../types";

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
