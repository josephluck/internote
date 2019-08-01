import aws4 from "aws4";
import { health } from "./health";
import { preferences } from "./preferences";
import { Session } from "./types";
import { speech } from "./speech";
import { dictionary } from "./dictionary";
import { notes } from "./notes";

export type MakeSignedRequest = (options: AwsSignedRequest) => any;

export interface AwsSignedRequest {
  path: string;
  session: Session;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
}

export function makeServicesApi({
  host,
  region
}: {
  host: string;
  region: string;
}) {
  const makeSignedRequest: MakeSignedRequest = ({
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
    delete request.headers["Host"];
    delete request.headers["Content-Length"];
    return request;
  };
  return {
    health: health(makeSignedRequest),
    preferences: preferences(makeSignedRequest),
    speech: speech(makeSignedRequest),
    dictionary: dictionary(makeSignedRequest),
    notes: notes(makeSignedRequest)
  };
}

export type ServicesApi = ReturnType<typeof makeServicesApi>;
