import Axios from "axios";
import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import {
  UpdateNoteDTO,
  CreateNoteDTO,
  GetNoteDTO
} from "@internote/notes-service/types";
import { ApiResponse } from "@internote/lib/types";
import { Err, Ok } from "space-lift";

export function notes(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): ApiResponse<GetNoteDTO[]> {
      try {
        const response = await Axios(
          makeRequest({
            path: "/notes",
            method: "GET",
            session
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    },
    async get(session: Session, noteId: string): ApiResponse<GetNoteDTO> {
      try {
        const response = await Axios(
          makeRequest({
            path: `/notes/${noteId}`,
            method: "GET",
            session
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    },
    async create(
      session: Session,
      note: Partial<CreateNoteDTO> = {}
    ): ApiResponse<GetNoteDTO> {
      try {
        const response = await Axios(
          makeRequest({
            path: "/notes",
            method: "POST",
            session,
            body: note
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    },
    async update(
      session: Session,
      noteId: string,
      note: Partial<UpdateNoteDTO>
    ): ApiResponse<GetNoteDTO> {
      try {
        const response = await Axios(
          makeRequest({
            path: `/notes/${noteId}`,
            method: "PUT",
            session,
            body: note
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    },
    async delete(session: Session, noteId: string): ApiResponse<void> {
      try {
        const response = await Axios(
          makeRequest({
            path: `/notes/${noteId}`,
            method: "DELETE",
            session
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    }
  };
}
