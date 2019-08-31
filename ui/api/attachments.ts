import "isomorphic-fetch";
import { Session } from "../auth/storage";
import AWS, { S3 } from "aws-sdk";

export function makeAttachmentsApi({
  region,
  bucketName
}: {
  /** AWS region bucket resides in */
  region: string;
  /** Name of the attachments bucket */
  bucketName: string;
}) {
  const getS3 = getS3Factory(region, bucketName);

  function getUploadKey(session: Session, noteId: string, file: File) {
    return `private/${session.identityId}/${noteId}/${file.name}`;
  }

  function getUploadLocation(session: Session, noteId: string, file: File) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${getUploadKey(
      session,
      noteId,
      file
    )}`;
  }

  async function upload(
    session: Session,
    noteId: string,
    file: File,
    onProgressUpdate?: (progress: S3.ManagedUpload.Progress) => void
  ): Promise<FileUploadResponse> {
    const upload = getS3(session).upload({
      Key: getUploadKey(session, noteId, file),
      Bucket: bucketName,
      Body: file,
      ContentType: file.type
    });
    return new Promise((resolve, reject) => {
      if (onProgressUpdate) {
        upload.on("httpUploadProgress", onProgressUpdate);
      }
      upload.send((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data as any);
        }
      });
    });
  }

  async function makePresignedUrl(session: Session, fileKey: string) {
    return await getS3(session).getSignedUrlPromise("getObject", {
      Bucket: bucketName,
      Key: fileKey,
      Expires: 1000
    });
  }

  return {
    upload,
    getUploadKey,
    getUploadLocation,
    makePresignedUrl
  };
}

interface FileUploadResponse {
  /** The name of the bucket that was uploaded to */
  Bucket: string;
  /** The key of the file relative to the root of the bucket */
  Key: "private/eu-west-1:292f6962-abc5-4290-9562-b9a106cbc8c3/85ebbf05-c09d-439e-aaec-5398279cf325/Welcome to Internote!  - f69958e64dc701bd18f1f7e4d339f5ee (1).html";
  /** The full URL path to the file (accessible for authenticated users to request) */
  Location: string;
  /** The same as Key */
  key: string;
}

function getS3Factory(region: string, bucketName: string) {
  return function getS3(session: Session) {
    AWS.config.update({
      region,
      accessKeyId: session.accessKeyId,
      secretAccessKey: session.secretKey,
      sessionToken: session.sessionToken
    });
    return new S3({
      region,
      params: {
        Bucket: bucketName
      }
    });
  };
}

export function getExtensionFromFileSrc(src: string): string {
  const withoutQuery = src.split("?")[0];
  const parts = withoutQuery.split(".");
  if (parts.length) {
    return parts[parts.length - 1];
  }
  return "";
}

export type AttachmentsApi = ReturnType<typeof makeAttachmentsApi>;
