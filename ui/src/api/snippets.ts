import { ApiResponse } from "@internote/lib/lambda";
import {
  CreateSnippetDTO,
  GetSnippetDTO,
} from "@internote/snippets-service/types";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

export function snippets(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): Promise<ApiResponse<GetSnippetDTO[]>> {
      return makeRequest({
        path: "/snippets",
        method: "GET",
        session,
      });
    },
    async create(
      session: Session,
      snippet: Partial<CreateSnippetDTO> = {}
    ): Promise<ApiResponse<GetSnippetDTO>> {
      return makeRequest({
        path: "/snippets",
        method: "POST",
        session,
        body: snippet,
      });
    },
    async delete(
      session: Session,
      snippetId: string
    ): Promise<ApiResponse<void>> {
      return makeRequest({
        path: `/snippets/${snippetId}`,
        method: "DELETE",
        session,
      });
    },
  };
}
