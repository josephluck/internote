import Axios from "axios";
import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import { Preferences } from "@internote/preferences-service/db/models";
import { ApiResponse } from "@internote/lib/types";
import { Err, Ok } from "space-lift";

export function preferences(makeRequest: MakeSignedRequest) {
  return {
    async get(session: Session): ApiResponse<Preferences> {
      try {
        const response = await Axios(
          makeRequest({
            path: "/preferences",
            method: "GET",
            session
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    },
    async update(
      session: Session,
      preferences: Partial<Preferences>
    ): ApiResponse<Preferences> {
      try {
        const response = await Axios(
          makeRequest({
            path: "/preferences",
            method: "PUT",
            session,
            body: preferences
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    }
  };
}
