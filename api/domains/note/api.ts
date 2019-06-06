import { Result, Ok, Err } from "space-lift";
import { Note, CreateNote, UpdateNote } from "./entity";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";

export function api(client: AxiosInstance) {
  return {
    findAll(token: string): Promise<Note[]> {
      return client
        .get("/notes", makeRequestConfig({ token }))
        .then(r => r.data);
    },
    findById(token: string, noteId: string): Promise<Result<Error, Note>> {
      return client
        .get(`/notes/${noteId}`, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    },
    create(
      token: string,
      payload: CreateNote = {}
    ): Promise<Result<Error, Note>> {
      return client
        .post("/notes", payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    },
    updateById(
      token: string,
      noteId: string,
      payload: UpdateNote
    ): Promise<Result<Error, Note>> {
      return client
        .put(`/notes/${noteId}`, payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => {
          console.log(err);
          return Err(err);
        });
    },
    deleteById(token: string, noteId: string): Promise<Result<Error, void>> {
      return client
        .delete(`/notes/${noteId}`, makeRequestConfig({ token }))
        .then(() => Ok(null))
        .catch(err => Err(err));
    }
  };
}

export default api;
