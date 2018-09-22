import { Result } from "space-lift";
import { Note } from "./entity";
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
        .then(r => r.data);
    },
    deleteById(token: string, noteId: string): Promise<Result<Error, Note>> {
      return client
        .delete(`/notes/${noteId}`, makeRequestConfig({ token }))
        .then(r => r.data);
    }
  };
}

export default api;
