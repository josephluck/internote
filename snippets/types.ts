import { Snippet } from "./db/models";

/**
 * Represents the get snippet DTO.
 */
export type GetSnippetDTO = Snippet;

/**
 * Represents the create snippet DTO.
 */
export interface CreateSnippetDTO
  extends Omit<Snippet, "snippetId" | "userId"> {}
