import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";
import { AuthenticatedResponse } from "@internote/health-service/types";

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
