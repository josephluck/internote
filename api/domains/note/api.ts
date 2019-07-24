import { Result, Ok, Err } from "space-lift";
import { Note, CreateNote, UpdateNote } from "./entity";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { ApiError } from "../../dependencies/messages";

export function api(client: AxiosInstance) {
  return {
    findAll(token: any): Promise<Note[]> {
      return client
        .get("/notes", makeRequestConfig({ token }))
        .then(r => r.data);
    },
    findById(token: any, noteId: string): Promise<Result<ApiError, Note>> {
      return client
        .get(`/notes/${noteId}`, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    },
    create(token: any, payload: CreateNote): Promise<Result<ApiError, Note>> {
      return client
        .post("/notes", payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    },
    updateById(
      token: any,
      noteId: string,
      payload: UpdateNote
    ): Promise<Result<ApiError, Note>> {
      return client
        .put(`/notes/${noteId}`, payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err.response.data));
    },
    deleteById(token: any, noteId: string): Promise<Result<ApiError, void>> {
      return client
        .delete(`/notes/${noteId}`, makeRequestConfig({ token }))
        .then(() => Ok(null))
        .catch(err => Err(err));
    }
  };
}

export default api;
