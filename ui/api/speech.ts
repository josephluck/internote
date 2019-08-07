import Axios from "axios";
import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import { ApiResponse } from "@internote/lib/types";
import { Err, Ok } from "space-lift";
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
      try {
        const response = await Axios(
          makeRequest({
            path: "/speech",
            method: "POST",
            session,
            body: request
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err.response.data);
      }
    }
  };
}
