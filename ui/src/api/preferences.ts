import { ApiResponse } from "@internote/lib/lambda";
import { Preferences } from "@internote/preferences-service/models";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

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
