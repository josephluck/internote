import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";
import { ApiResponse } from "@internote/lib/types";

export function tags(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): ApiResponse<string[]> {
      return makeRequest({
        path: "/tags",
        method: "GET",
        session
      });
    }
  };
}
