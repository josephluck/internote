import { AuthenticatedResponse } from "@internote/health-service/types";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

export function health(makeRequest: MakeSignedRequest) {
  return {
    async authenticated(session: Session): Promise<AuthenticatedResponse> {
      return makeRequest({
        path: "/authenticated",
        method: "GET",
        session,
      });
    },
  };
}
