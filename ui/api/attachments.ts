import { Err, Ok } from "space-lift";
import "isomorphic-fetch";
import aws4 from "aws4";
import { Session } from "../auth/storage";
import { decodeIdToken } from "../auth/decode";

export type MakeSignedRequest = (options: AwsSignedRequest) => any;

export interface AwsSignedRequest {
  path: string;
  session: Session;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
}

export function makeAttachmentsApi({
  region,
  host
}: {
  /** AWS region for services */
  region: string;
  /** Host path for S3 bucket (see env.reference ATTACHMENTS_S3_HOST) */
  host: string;
}) {
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
        url: `${host}${path}`,
        method,
        region,
        service: "s3",
        data: body,
        body
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
      body
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

  async function uploadFile(session: Session, file: File): Promise<void> {
    const { sub } = decodeIdToken(session.idToken);
    const response = await makeSignedRequest({
      session,
      body: file,
      path: `/private/${sub}/${Date.now()}`,
      method: "POST"
    });
    console.log(response);
  }
  return {
    uploadFile
  };
}

export type AttachmentsApi = ReturnType<typeof makeAttachmentsApi>;
