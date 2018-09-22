import { Result } from "space-lift";
import { User } from "./entity";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";

export function api(client: AxiosInstance) {
  return {
    findAll(token: string): Promise<User[]> {
      return client
        .get("/users", makeRequestConfig({ token }))
        .then(r => r.data);
    },
    findById(token: string, userId: string): Promise<Result<Error, User>> {
      return client
        .get(`/users/${userId}`, makeRequestConfig({ token }))
        .then(r => r.data);
    },
    deleteById(token: string, userId: string): Promise<Result<Error, User>> {
      return client
        .delete(`/users/${userId}`, makeRequestConfig({ token }))
        .then(r => r.data);
    }
  };
}

export default api;
