import { Result, Ok, Err } from "space-lift";
import { UpdatePreferences, Preferences } from "./entity";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";

export function api(client: AxiosInstance) {
  return {
    updateById(
      token: string,
      preferences: Partial<UpdatePreferences>
    ): Promise<Result<Error, Preferences>> {
      return client
        .put(`/preferences`, preferences, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    }
  };
}

export default api;
