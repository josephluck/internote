import { Result, Ok, Err } from "space-lift";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { ApiError } from "../../dependencies/messages";
import { Tag } from "./entity";

export function api(client: AxiosInstance) {
  return {
    getAll(token: string): Promise<Result<ApiError, Tag[]>> {
      return client
        .get(`/tags`, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    }
  };
}

export default api;
