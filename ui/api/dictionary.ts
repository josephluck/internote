import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";
import {
  LookupRequestBody,
  LookupResponseBody,
} from "@internote/dictionary-service/types";
import { ApiResponse } from "@internote/lib/types";

export function dictionary(makeRequest: MakeSignedRequest) {
  return {
    async lookup(
      session: Session,
      request: LookupRequestBody
    ): ApiResponse<LookupResponseBody> {
      return makeRequest({
        path: "/dictionary/lookup",
        method: "POST",
        session,
        body: request,
      });
    },
  };
}
