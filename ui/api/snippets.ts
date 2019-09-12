import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";
import {
  CreateSnippetDTO,
  GetSnippetDTO
} from "@internote/snippets-service/types";
import { ApiResponse } from "@internote/lib/types";

export function snippets(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): ApiResponse<GetSnippetDTO[]> {
      return makeRequest({
        path: "/snippets",
        method: "GET",
        session
      });
    },
    async create(
      session: Session,
      snippet: Partial<CreateSnippetDTO> = {}
    ): ApiResponse<GetSnippetDTO> {
      return makeRequest({
        path: "/snippets",
        method: "POST",
        session,
        body: snippet
      });
    },
    async delete(session: Session, snippetId: string): ApiResponse<void> {
      return makeRequest({
        path: `/snippets/${snippetId}`,
        method: "DELETE",
        session
      });
    }
  };
}
