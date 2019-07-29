import Axios from "axios";
import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import {
  LookupRequestBody,
  LookupResponseBody
} from "@internote/dictionary-service/types";
import { ApiResponse } from "@internote/lib/types";
import { Err, Ok } from "space-lift";

export function dictionary(makeRequest: MakeSignedRequest) {
  return {
    async lookup(
      session: Session,
      request: LookupRequestBody
    ): ApiResponse<LookupResponseBody> {
      try {
        const response = await Axios(
          makeRequest({
            path: "/dictionary/lookup",
            method: "POST",
            session,
            body: request
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err);
      }
    }
  };
}
