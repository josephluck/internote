import "isomorphic-fetch";
import { Session } from "../auth/storage";
import AWS, { S3 } from "aws-sdk";

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
    AWS.config.update({
      region,
      accessKeyId: session.accessKeyId,
      secretAccessKey: session.secretKey,
      sessionToken: session.sessionToken
    });
    const s3 = new S3({
      region,
      params: {
        Bucket: bucketName
      }
    });
    const upload = s3.upload({
      Key: `private/${session.identityId}/${Date.now()}.html`,
      Bucket: bucketName,
      Body: file,
      ContentType: file.type
    });

    upload.send((err, data) => {
      if (err) {
        console.log({ err });
      } else {
        console.log({ data });
      }
    });

    return Promise.resolve();
  }
  return {
    uploadFile
  };
}

export type AttachmentsApi = ReturnType<typeof makeAttachmentsApi>;
