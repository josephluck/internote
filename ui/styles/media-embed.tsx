import React, { useState, useEffect, useCallback } from "react";
import { uploadSignal } from "./file-upload";
import { RenderBlockProps } from "slate-react";
import {
  makeAttachmentsApi,
  getExtensionFromFileSrc
} from "../api/attachments";
import { env } from "../env";
import { useTwineState } from "../store";
import styled from "styled-components";
import { borderRadius, spacing, font } from "../theming/symbols";
import { sansSerif } from "../theming/themes";
import { FileType } from "@internote/export-service/types";
import { Flex } from "@rebass/grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
import { Uploading } from "./uploading";

const attachments = makeAttachmentsApi({
  region: env.SERVICES_REGION,
  bucketName: env.ATTACHMENTS_BUCKET_NAME
});

const Img = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: ${borderRadius._4};
`;

const UnknownFileWrap = styled.div`
  background: ${props => props.theme.toolbarBackground}; // TODO: own theme
  border-radius: ${borderRadius._4};
  padding: ${spacing._0_5} ${spacing._1};
  display: inline-flex;
  flex-direction: column;
  max-width: 400px;
`;

const UnknownFileExtensionWrap = styled.div`
  display: flex;
  align-items: center;
`;

const UnknownFileExtension = styled.span`
  display: inline-block;
  font-size: ${font._36.size};
  line-height: ${font._36.size};
  color: ${props => props.theme.toolbarButtonInactiveText}; // TODO: own theme
  font-weight: bold;
  letter-spacing: 1px;
  font-family: ${sansSerif.fontFamily};
`;

const UnknownFileName = styled.span`
  font-size: ${font._18.size};
  line-height: ${font._16.lineHeight};
`;

const FileIcon = styled.div`
  flex: 0 0 auto;
  color: ${props => props.theme.toolbarButtonInactiveText}; // TODO: own theme
  font-size: ${font._24.size};
  display: flex;
  margin-right: ${spacing._0_5};
`;

const DownloadIcon = styled.div`
  cursor: pointer;
  font-size: ${font._18.size};
  margin-left: ${spacing._1};
  color: ${props => props.theme.toolbarButtonInactiveText}; // TODO: own theme
  transition: color 300ms ease;
  display: flex;
  &:hover {
    color: ${props => props.theme.toolbarButtonActiveText}; // TODO: own theme
  }
`;

export function MediaEmbed({ node, editor }: RenderBlockProps) {
  const initialUploaded = node.data.get("uploaded");
  const name = node.data.get("name");
  const key = node.data.get("key");
  const src = node.data.get("src");
  const type = node.get("type") as FileType;

  const session = useTwineState(state => state.auth.session);
  const [uploaded, setUploaded] = useState(initialUploaded);
  const [uploadProgress, setUploadProgress] = useState(
    initialUploaded ? 100 : 0
  );
  const [presignedUrl, setPresignedUrl] = useState("");

  useEffect(() => {
    const binding = uploadSignal.add(e => {
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
              uploaded: true
            }
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

  const downloadFile = useCallback(() => {
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
      <UnknownFileWrap>
        <Flex
          flex={1}
          alignItems="center"
          style={{ marginBottom: spacing._0_5 }}
        >
          {extension ? (
            <UnknownFileExtensionWrap>
              <FileIcon>
                <FontAwesomeIcon icon={faFile} />{" "}
                {/* TODO: would be nice to map unknown file types to specific icons */}
              </FileIcon>
              <UnknownFileExtension>.{extension}</UnknownFileExtension>
            </UnknownFileExtensionWrap>
          ) : null}
          <Flex flex={1} />
          <DownloadIcon onClick={downloadFile}>
            <FontAwesomeIcon icon={faDownload} />
          </DownloadIcon>
        </Flex>
        <UnknownFileName>{name}</UnknownFileName>
      </UnknownFileWrap>
    );
  }

  return <Uploading progress={uploadProgress} name={name} />;
}
