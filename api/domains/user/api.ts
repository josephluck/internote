import { Result, Ok, Err } from "space-lift";
import { User } from "./entity";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { ApiError } from "../../dependencies/messages";

export function api(client: AxiosInstance) {
  return {
    findAll(token: any): Promise<User[]> {
      return client
        .get("/users", makeRequestConfig({ token }))
        .then(r => r.data);
    },
    findById(token: any, userId: string): Promise<Result<ApiError, User>> {
      return client
        .get(`/users/${userId}`, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    },
    deleteById(token: any, userId: string): Promise<Result<ApiError, void>> {
      return client
        .delete(`/users/${userId}`, makeRequestConfig({ token }))
        .then(() => Ok(null))
        .catch(err => Err(err));
    }
  };
}

export default api;
