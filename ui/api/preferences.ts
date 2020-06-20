import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";
import { Preferences } from "@internote/preferences-service/db/models";
import { ApiResponse } from "@internote/lib/lambda";

export function preferences(makeRequest: MakeSignedRequest) {
  return {
    async get(session: Session): ApiResponse<Preferences> {
      return makeRequest({
        path: "/preferences",
        method: "GET",
        session,
      });
    },
    async update(
      session: Session,
      preferences: Partial<Preferences>
    ): ApiResponse<Preferences> {
      return makeRequest({
        path: "/preferences",
        method: "PUT",
        session,
        body: preferences,
      });
    },
  };
}
