import { Result, Ok, Err } from "space-lift";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { GenerateRequest, GenerateResponse } from "./routes";

export function api(client: AxiosInstance) {
  return {
    generate(
      token: string,
      payload: GenerateRequest
    ): Promise<Result<Error, GenerateResponse>> {
      return client
        .post(`/speech`, payload, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    }
  };
}

export default api;
