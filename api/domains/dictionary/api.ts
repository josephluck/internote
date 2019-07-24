import { Result, Ok, Err } from "space-lift";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { LookupRequest, LookupResponse } from "./routes";
import { ApiError } from "../../dependencies/messages";

export function api(client: AxiosInstance) {
  return {
    lookup(
      token: any,
      payload: LookupRequest
    ): Promise<Result<ApiError, LookupResponse>> {
      return client
        .post(`/dictionary`, payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    }
  };
}

export default api;
