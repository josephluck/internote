import aws4 from "aws4";
import { health } from "./health";
import { Session } from "./types";

export type MakeSignedRequest = (options: AwsSignedRequest) => any;

export interface AwsSignedRequest {
  path: string;
  session: Session;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

// env.SERVICES_REGION

export function makeServicesApi({
  host,
  region
}: {
  host: string;
  region: string;
}) {
  const makeSignedRequest: MakeSignedRequest = ({ path, session, method }) => {
    const request = aws4.sign(
      {
        host,
        path,
        url: `https://${host}${path}`,
        method,
        region,
        service: "execute-api"
      },
      session
    );
    delete request.headers["Host"];
    delete request.headers["Content-Length"];
    return request;
  };
  return {
    health: health(makeSignedRequest)
  };
}

export type ServicesApi = ReturnType<typeof makeServicesApi>;
