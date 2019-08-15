import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import {
  UpdateNoteDTO,
  CreateNoteDTO,
  GetNoteDTO,
  SyncNotesDTO
} from "@internote/notes-service/types";
import { ApiResponse } from "@internote/lib/types";

export function notes(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): ApiResponse<GetNoteDTO[]> {
      return makeRequest({
        path: "/notes",
        method: "GET",
        session
      });
    },
    async get(session: Session, noteId: string): ApiResponse<GetNoteDTO> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "GET",
        session
      });
    },
    async create(
      session: Session,
      body: Partial<CreateNoteDTO> = {}
    ): ApiResponse<GetNoteDTO> {
      return makeRequest({
        path: "/notes",
        method: "POST",
        session,
        body
      });
    },
    async update(
      session: Session,
      noteId: string,
      body: Partial<UpdateNoteDTO>
    ): ApiResponse<GetNoteDTO> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "PUT",
        session,
        body
      });
    },
    async sync(
      session: Session,
      body: SyncNotesDTO
    ): ApiResponse<GetNoteDTO[]> {
      return makeRequest({
        path: `/notes/sync`,
        method: "PUT",
        session,
        body
      });
    },
    async delete(session: Session, noteId: string): ApiResponse<void> {
      return makeRequest({
        path: `/notes/${noteId}`,
        method: "DELETE",
        session
      });
    }
  };
}
