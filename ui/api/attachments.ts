import "isomorphic-fetch";
import { Session } from "../auth/storage";
import { decodeIdToken } from "../auth/decode";
import { S3 } from "aws-sdk";

export type MakeSignedRequest = (options: AwsSignedRequest) => any;

export interface AwsSignedRequest {
  path: string;
  session: Session;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
}

export function makeAttachmentsApi({
  region,
  bucketName
}: {
  /** AWS region for services */
  region: string;
  /** Name of the bucket */
  bucketName: string;
}) {
  async function uploadFile(session: Session, file: File): Promise<any> {
    const { sub } = decodeIdToken(session.idToken);

    // TODO: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-browser.html
    const s3Instance = new S3({ region });
    const request = s3Instance.upload({
      Key: `private/${sub}/${Date.now()}/${file.name}`,
      Bucket: bucketName,
      Body: file,
      ContentType: file.type
    });

    return new Promise((resolve, reject) => {
      request.send((err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log({ data });
          resolve(data);
        }
      });
    });
  }
  return {
    uploadFile
  };
}

export type AttachmentsApi = ReturnType<typeof makeAttachmentsApi>;
