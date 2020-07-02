import {
  LookupRequestBody,
  LookupResponseBody,
} from "@internote/dictionary-service/types";
import { ApiResponse } from "@internote/lib/lambda";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

export function dictionary(makeRequest: MakeSignedRequest) {
  return {
    async lookup(
      session: Session,
      request: LookupRequestBody
    ): Promise<ApiResponse<LookupResponseBody>> {
      return makeRequest({
        path: "/dictionary",
        method: "POST",
        session,
        body: request,
      });
    },
  };
}
