import { ApiResponse } from "@internote/lib/lambda";
import {
  SpeechRequestBody,
  SpeechResponseBody,
} from "@internote/speech-service/types";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

export function speech(makeRequest: MakeSignedRequest) {
  return {
    async create(
      session: Session,
      request: SpeechRequestBody
    ): ApiResponse<SpeechResponseBody> {
      return makeRequest({
        path: "/speech",
        method: "POST",
        session,
        body: request,
      });
    },
  };
}
