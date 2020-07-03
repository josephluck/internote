import "isomorphic-fetch";

import aws4 from "aws4";
import { Err, Ok } from "space-lift";

import { isNearExpiry } from "../auth/api";
import { Session } from "../auth/storage";
import { refreshToken } from "../store/auth/auth";
import { store } from "../store/store";
import { dictionary } from "./dictionary";
import { exportNote } from "./export";
import { notes } from "./notes";
import { preferences } from "./preferences";
import { snippets } from "./snippets";
import { speech } from "./speech";
import { tags } from "./tags";

export type MakeSignedRequest = (options: AwsSignedRequest) => any;

export interface AwsSignedRequest {
  /**
   * The path from the root of the services gateway
   *
   * NB: MUST include leading `/` e.e. `/preferences`.
   */
  path: string;
  // TODO: session could be renamed to 'authenticated: boolean' since
  // makeSignedRequest pulls out the session from the store automatically
  session: Session;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
}

export function makeApi({
  host: root,
  region,
}: {
  host: string;
  region: string;
}) {
  const makeSignedRequest: MakeSignedRequest = async (request) => {
    if (!request.path.startsWith("/")) {
      throw new Error(
        `Failed to make API request. The path ${request.path} must begin with a leading "/".`
      );
    }

    /**
     * Refresh the authentication token if present and near expiry.
     */
    let session = store.getState().auth.session;
    if (
      session &&
      session.expiration &&
      session.refreshToken &&
      isNearExpiry(session.expiration * 1000) // NB: expiration is in seconds not ms
    ) {
      await refreshToken(session.refreshToken);
      const state = store.getState();
      session = state.auth.session;
    }

    /**
     * NB: aws4 signing expects the host to _not_ include the protocol or trailing
     * slash.
     */

    const rootHost = root.endsWith("/") ? root.slice(0, -1) : root; // Remove trailing / from SSM

    const { host, path, protocol } = aws4UrlParse(`${rootHost}${request.path}`);

    const options = {
      host,
      path,
      url: `${protocol}//${host}${path}`,
      method: request.method,
      region,
      service: "execute-api",
      data: request.body,
      body: request.body ? JSON.stringify(request.body) : undefined,
      headers: request.body
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
    };

    const signedRequest = aws4.sign(options, {
      accessKeyId: session.accessKeyId,
      secretAccessKey: session.secretKey,
      sessionToken: session.sessionToken,
    });

    const response = await fetch(signedRequest.url, {
      method: request.method,
      headers: signedRequest.headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
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
  };

  return {
    preferences: preferences(makeSignedRequest),
    speech: speech(makeSignedRequest),
    dictionary: dictionary(makeSignedRequest),
    notes: notes(makeSignedRequest),
    tags: tags(makeSignedRequest),
    snippets: snippets(makeSignedRequest),
    exportNote: exportNote(makeSignedRequest),
  };
}

export type Api = ReturnType<typeof makeApi>;

export const aws4UrlParse = (url: string) => {
  const u = new URL(url);
  return {
    host: u.host,
    path: u.pathname,
    protocol: u.protocol,
  };
};
