import React, { useState, useEffect, useCallback } from "react";
import { uploadSignal } from "./file-upload";
import {
  makeAttachmentsApi,
  getExtensionFromFileSrc,
} from "../api/attachments";
import { env } from "../env";
import { useTwineState } from "../store";
import styled from "styled-components";
import { borderRadius } from "../theming/symbols";

import { Uploading } from "./uploading";
import { UnknownFile } from "./unknown-file";

const attachments = makeAttachmentsApi({
  region: env.SERVICES_REGION,
  bucketName: env.ATTACHMENTS_BUCKET_NAME,
});

const Img = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: ${borderRadius._4};
`;

// TODO
export function MediaEmbed({ node, editor }: any) {
  const initialUploaded = node.data.get("uploaded");
  const name = node.data.get("name");
  const key = node.data.get("key");
  const src = node.data.get("src");
  const type = node.get("type");

  const session = useTwineState((state) => state.auth.session);
  const [uploaded, setUploaded] = useState(initialUploaded);
  const [uploadProgress, setUploadProgress] = useState(
    initialUploaded ? 100 : 0
  );
  const [presignedUrl, setPresignedUrl] = useState("");

  useEffect(() => {
    const binding = uploadSignal.add((e) => {
      if (e.src === src && e.key === key && e.name === name) {
        setUploaded(e.uploaded);
        setUploadProgress(e.progress);
        if (e.uploaded) {
          editor.setNodeByKey(node.key, {
            type,
            data: {
              src,
              key,
              name,
              uploaded: true,
            },
          });
        }
      }
    });
    return () => {
      binding.detach();
    };
  }, [src, key, name]);

  useEffect(() => {
    async function doEffect() {
      if (uploaded) {
        const url = await attachments.makePresignedUrl(session, key);
        setPresignedUrl(url);
      }
    }
    doEffect();
  }, [uploaded, session]);

  const handleDownloadFile = useCallback(() => {
    window.open(presignedUrl, "_blank");
  }, [presignedUrl]);

  if (uploaded && presignedUrl) {
    if (type === "image") {
      return <Img src={presignedUrl} />;
    }
    if (type === "video") {
      return <video src={presignedUrl} controls />;
    }
    if (type === "audio") {
      return <audio src={presignedUrl} controls />;
    }
    const extension = getExtensionFromFileSrc(presignedUrl);
    return (
      <UnknownFile
        name={name}
        extension={extension}
        onDownloadFile={handleDownloadFile}
      />
    );
  }

  return <Uploading progress={uploadProgress} name={name} />;
}
