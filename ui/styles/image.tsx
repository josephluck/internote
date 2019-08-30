import { useState, useEffect } from "react";
import { uploadSignal } from "./file-upload";
import { RenderBlockProps } from "slate-react";
import { makeAttachmentsApi } from "../api/attachments";
import { env } from "../env";
import { useTwineState } from "../store";
import styled from "styled-components";
import { borderRadius } from "../theming/symbols";

const attachments = makeAttachmentsApi({
  region: env.SERVICES_REGION,
  bucketName: env.ATTACHMENTS_BUCKET_NAME
});

const Img = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: ${borderRadius._4};
`;

export function InternoteImage({ node, editor }: RenderBlockProps) {
  const initialUploaded = node.data.get("uploaded");
  const fileName = node.data.get("name");
  const fileKey = node.data.get("key");
  const src = node.data.get("src");

  const session = useTwineState(state => state.auth.session);
  const [uploaded, setUploaded] = useState(initialUploaded);
  const [uploadProgress, setUploadProgress] = useState(
    initialUploaded ? 100 : 0
  );
  const [presignedUrl, setPresignedUrl] = useState("");

  useEffect(() => {
    const binding = uploadSignal.add(e => {
      if (e.src === src && e.fileKey === fileKey && e.fileName === fileName) {
        setUploaded(e.uploaded);
        setUploadProgress(e.progress);
        if (e.uploaded) {
          editor.setNodeByKey(node.key, {
            type: "image",
            data: {
              src,
              key: fileKey,
              name: fileName,
              uploaded: true
            }
          });
        }
      }
    });
    return () => {
      binding.detach();
    };
  }, [src, fileKey, fileName]);

  useEffect(() => {
    async function doEffect() {
      if (uploaded) {
        const url = await attachments.makePresignedUrl(session, fileKey);
        setPresignedUrl(url);
      }
    }
    doEffect();
  }, [uploaded, session]);

  if (uploaded && presignedUrl) {
    return <Img src={presignedUrl} />;
  }

  return (
    <div style={{ background: "red", fontSize: 40 }}>{uploadProgress}%</div>
  );
}
