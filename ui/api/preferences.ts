import Axios from "axios";
import { Session } from "./types";
import { MakeSignedRequest } from "./api";
import { Preferences } from "@internote/preferences-service/db/models";

export function preferences(makeRequest: MakeSignedRequest) {
  return {
    async get(session: Session): Promise<Preferences> {
      const response = await Axios(
        makeRequest({
          path: "/preferences",
          method: "GET",
          session
        })
      );
      return response.data;
    },
    async update(session: Session, preferences: Partial<Preferences>) {
      const response = await Axios(
        makeRequest({
          path: "/preferences",
          method: "PUT",
          session,
          body: preferences
        })
      );
      return response.data;
    }
  };
}
