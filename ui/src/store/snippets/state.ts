import { GetSnippetDTO } from "@internote/snippets-service/types";

export type SnippetsState = {
  snippets: GetSnippetDTO[];
};

export const snippetsInitialState: SnippetsState = {
  snippets: [],
};
