import { ApiResponse } from "@internote/lib/lambda";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

export function tags(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): Promise<ApiResponse<string[]>> {
      return makeRequest({
        path: "/tags",
        method: "GET",
        session,
      });
    },
  };
}
