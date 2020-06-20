import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";
import {
  UpdateNoteDTO,
  CreateNoteDTO,
  GetNoteDTO,
} from "@internote/notes-service/types";
import { ApiResponse } from "@internote/lib/lambda";

export function notes(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): ApiResponse<GetNoteDTO[]> {
      return makeRequest({
        path: "/notes",
        method: "GET",
        session,
      });
    },
    async get(session: Session, noteId: string): ApiResponse<GetNoteDTO> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "GET",
        session,
      });
    },
    async create(
      session: Session,
      note: Partial<CreateNoteDTO> = {}
    ): ApiResponse<GetNoteDTO> {
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
    ): ApiResponse<GetNoteDTO> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "PUT",
        session,
        body: note,
      });
    },
    async delete(session: Session, noteId: string): ApiResponse<void> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "DELETE",
        session,
      });
    },
  };
}
