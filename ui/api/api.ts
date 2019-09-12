import "isomorphic-fetch";
import aws4 from "aws4";
import { health } from "./health";
import { preferences } from "./preferences";
import { Session } from "../auth/storage";
import { speech } from "./speech";
import { dictionary } from "./dictionary";
import { notes } from "./notes";
import { tags } from "./tags";
import { snippets } from "./snippets";
import { exportNote } from "./export";
import { Err, Ok } from "space-lift";
import { Store } from "../store";
import { isNearExpiry } from "../auth/api";

export type MakeSignedRequest = (options: AwsSignedRequest) => any;

export interface AwsSignedRequest {
  path: string;
  // TODO: session could be renamed to 'authenticated: boolean' since
  // makeSignedRequest pulls out the session from the store automatically
  session: Session;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
}

export function makeApi({ host, region }: { host: string; region: string }) {
  let store: Store = null;

  const makeSignedRequest: MakeSignedRequest = async ({
    path,
    method,
    body
  }) => {
    if (store) {
      // NB: refresh token if needed
      let session = store.getState().auth.session;
      if (
        session &&
        session.expiration &&
        session.refreshToken &&
        isNearExpiry(session.expiration * 1000) // NB: expiration is in seconds not ms
      ) {
        await store.actions.auth.refreshToken(session.refreshToken);
        const state = store.getState();
        session = state.auth.session;
      }
      const request = aws4.sign(
        {
          host,
          path,
          url: `https://${host}${path}`,
          method,
          region,
          service: "execute-api",
          data: body,
          body: body ? JSON.stringify(body) : undefined,
          headers: body
            ? {
                "Content-Type": "application/json"
              }
            : undefined
        },
        {
          accessKeyId: session.accessKeyId,
          secretAccessKey: session.secretKey,
          sessionToken: session.sessionToken
        }
      );
      const response = await fetch(request.url, {
        method,
        headers: request.headers,
        body: body ? JSON.stringify(body) : undefined
      });
      if (!response.ok) {
        try {
          const json = await response.json();
          return Err(json);
        } catch (err) {
          return Err("Response error was not JSON");
        }
      }
      try {
        const json = await response.json();
        return Ok(json);
      } catch (err) {
        return Err("Response error was not JSON");
      }
    } else {
      throw new Error("Store is not configured");
    }
  };

  return {
    health: health(makeSignedRequest),
    preferences: preferences(makeSignedRequest),
    speech: speech(makeSignedRequest),
    dictionary: dictionary(makeSignedRequest),
    notes: notes(makeSignedRequest),
    tags: tags(makeSignedRequest),
    snippets: snippets(makeSignedRequest),
    exportNote: exportNote(makeSignedRequest),
    setStore: (s: Store) => (store = s)
  };
}

export type Api = ReturnType<typeof makeApi>;
