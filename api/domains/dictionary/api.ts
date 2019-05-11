import { Result, Ok, Err } from "space-lift";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { LookupRequest, LookupResponse } from "./routes";

export function api(client: AxiosInstance) {
  return {
    lookup(
      token: string,
      payload: LookupRequest
    ): Promise<Result<Error, LookupResponse>> {
      return client
        .post(`/dictionary`, payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    }
  };
}

export default api;
