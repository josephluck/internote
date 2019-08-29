import { useCallback, FormEvent } from "react";
import { makeAttachmentsApi } from "../api/attachments";
import { env } from "../env";
import { useTwineState } from "../store";

const attachmentsApi = makeAttachmentsApi({
  region: env.SERVICES_REGION,
  host: env.ATTACHMENTS_S3_HOST
});

export const FileUpload = () => {
  const session = useTwineState(state => state.auth.session);
  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput: HTMLFormElement = document.querySelector(".files");
    const firstFile: File =
      fileInput.files && fileInput.files.length > 0
        ? fileInput.files[0]
        : undefined;
    if (firstFile) {
      const response = await attachmentsApi.uploadFile(session, firstFile);
      console.log(response);
    }
  }, []);
  return (
    <form onSubmit={onSubmit}>
      <input type="file" className="files" />
      <button type="submit">Submit</button>
    </form>
  );
};
