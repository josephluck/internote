import { ApiResponse } from "@internote/lib/lambda";
import {
  CreateNoteDTO,
  GetNoteDTO,
  UpdateNoteDTO,
} from "@internote/notes-service/types";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

export function notes(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): Promise<ApiResponse<GetNoteDTO[]>> {
      return makeRequest({
        path: "/notes",
        method: "GET",
        session,
      });
    },
    async get(
      session: Session,
      noteId: string
    ): Promise<ApiResponse<GetNoteDTO>> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "GET",
        session,
      });
    },
    async create(
      session: Session,
      note: Partial<CreateNoteDTO> = {}
    ): Promise<ApiResponse<GetNoteDTO>> {
      return makeRequest({
        path: "/notes",
        method: "POST",
        session,
        body: note,
      });
    },
    async update(
      session: Session,
      noteId: string,
      note: Partial<UpdateNoteDTO>
    ): Promise<ApiResponse<GetNoteDTO>> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "PUT",
        session,
        body: note,
      });
    },
    async delete(session: Session, noteId: string): Promise<ApiResponse<void>> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "DELETE",
        session,
      });
    },
  };
}
