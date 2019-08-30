import { Signal } from "signals";
import { useCallback, FormEvent } from "react";
import { makeAttachmentsApi } from "../api/attachments";
import { env } from "../env";
import { useTwineState } from "../store";

const attachments = makeAttachmentsApi({
  region: env.SERVICES_REGION,
  bucketName: env.ATTACHMENTS_BUCKET_NAME
});

export interface InternoteUploadEvent {
  src: string;
  fileKey: string;
  fileName: string;
  progress: number;
  uploaded: boolean;
}

export const uploadSignal = (new Signal() as any) as Signal<
  InternoteUploadEvent
>;

export const FileUpload = ({
  noteId,
  onUploadStarted,
  onUploadProgress,
  onUploadFinished
}: {
  noteId: string;
  onUploadStarted: (e: InternoteUploadEvent) => void;
  onUploadProgress?: (e: InternoteUploadEvent) => void;
  onUploadFinished?: (e: InternoteUploadEvent) => void;
}) => {
  const session = useTwineState(state => state.auth.session);
  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput: HTMLFormElement = document.querySelector(".files");
    const file: File =
      fileInput.files && fileInput.files.length > 0
        ? fileInput.files[0]
        : undefined;
    if (file) {
      const src = attachments.getUploadLocation(session, noteId, file);
      const fileKey = attachments.getUploadKey(session, noteId, file);
      const uploadStartEvent = {
        src,
        fileKey,
        fileName: file.name,
        progress: 0,
        uploaded: false
      };
      onUploadStarted(uploadStartEvent);
      uploadSignal.dispatch(uploadStartEvent);
      await attachments.upload(session, noteId, file, progress => {
        const percentage = (progress.loaded / progress.total) * 100;
        const uploadProgressEvent = {
          src,
          fileKey,
          fileName: file.name,
          progress: percentage,
          uploaded: false
        };
        uploadSignal.dispatch(uploadProgressEvent);
        if (onUploadProgress) {
          onUploadProgress(uploadProgressEvent);
        }
      });
      const uploadFinishedEvent = {
        src,
        fileKey,
        fileName: file.name,
        progress: 100,
        uploaded: true
      };
      if (onUploadFinished) {
        onUploadFinished(uploadFinishedEvent);
      }
      uploadSignal.dispatch(uploadFinishedEvent);
    }
  }, []);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="file" className="files" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
