import "isomorphic-fetch";
import aws4 from "aws4";
import { health } from "./health";
import { preferences } from "./preferences";
import { Session } from "./types";
import { speech } from "./speech";
import { dictionary } from "./dictionary";
import { notes } from "./notes";
import { tags } from "./tags";
import { Err, Ok } from "space-lift";

export type MakeSignedRequest = (options: AwsSignedRequest) => any;

export interface AwsSignedRequest {
  path: string;
  session: Session;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
}

export function makeApi({ host, region }: { host: string; region: string }) {
  const makeSignedRequest: MakeSignedRequest = async ({
    path,
    session,
    method,
    body
  }) => {
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
  };

  return {
    health: health(makeSignedRequest),
    preferences: preferences(makeSignedRequest),
    speech: speech(makeSignedRequest),
    dictionary: dictionary(makeSignedRequest),
    notes: notes(makeSignedRequest),
    tags: tags(makeSignedRequest)
  };
}

export type Api = ReturnType<typeof makeApi>;
