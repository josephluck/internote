import Axios from "axios";
import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import { AuthenticatedResponse } from "@internote/health-service/types";

export function health(makeRequest: MakeSignedRequest) {
  return {
    async authenticated(session: Session): Promise<AuthenticatedResponse> {
      const response = await Axios(
        makeRequest({
          path: "/authenticated",
          method: "GET",
          session
        })
      );
      return response.data;
    }
  };
}
