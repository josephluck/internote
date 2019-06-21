import { Result, Ok, Err } from "space-lift";
import { UpdatePreferences, Preferences, AvailableVoice } from "./entity";
import { AxiosInstance } from "axios";
import { makeRequestConfig } from "../api";
import { ApiError } from "../../dependencies/messages";

// TODO: trim this down to two voices?
export const availableVoices: AvailableVoice[] = [
  "Joey",
  "Justin",
  "Matthew",
  "Ivy",
  "Joanna",
  "Kendra",
  "Brian",
  "Amy",
  "Emma",
  "Nicole",
  "Russell"
];

export function api(client: AxiosInstance) {
  return {
    update(
      token: string,
      preferences: Partial<UpdatePreferences>
    ): Promise<Result<ApiError, Preferences>> {
      return client
        .put(`/preferences`, preferences, makeRequestConfig({ token }))
        .then(r => Ok(r.data))
        .catch(err => Err(err));
    }
  };
}

export default api;
