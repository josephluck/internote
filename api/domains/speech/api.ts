import { Result, Ok, Err } from "space-lift";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { GenerateRequest, GenerateResponse } from "./routes";
import { ApiError } from "../../dependencies/messages";

export function api(client: AxiosInstance) {
  return {
    generate(
      token: string,
      payload: GenerateRequest
    ): Promise<Result<ApiError, GenerateResponse>> {
      return client
        .post(`/speech`, payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    }
  };
}

export default api;
