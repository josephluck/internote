import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { api } from "../api";
import { getExtensionFromFileSrc } from "../api/attachments";
import { useStately } from "../store/store";
import { borderRadius } from "../theming/symbols";
import { uploadSignal } from "./file-upload";
import { UnknownFile } from "./unknown-file";
import { Uploading } from "./uploading";

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

  const session = useStately((state) => state.auth.session);
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
        const url = await api.attachments.makePresignedUrl(session, key);
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
