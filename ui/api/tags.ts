import Axios from "axios";
import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import { ApiResponse } from "@internote/lib/types";
import { Err, Ok } from "space-lift";

export function tags(makeRequest: MakeSignedRequest) {
  return {
    async list(session: Session): ApiResponse<string[]> {
      try {
        const response = await Axios(
          makeRequest({
            path: "/tags",
            method: "GET",
            session
          })
        );
        return Ok(response.data);
      } catch (err) {
        return Err(err);
      }
    }
  };
}
