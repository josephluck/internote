import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";
import { ApiResponse } from "@internote/lib/types";
import {
  SpeechResponseBody,
  SpeechRequestBody
} from "@internote/speech-service/types";

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
        body: request
      });
    }
  };
}
