import { Signal } from "signals";
import React, { useCallback, FormEvent, useRef, useState } from "react";
import { makeAttachmentsApi } from "../api/attachments";
import { env } from "../env";
import { useTwineState } from "../store";
import styled from "styled-components";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { Flex } from "@rebass/grid";
import { spacing } from "../theming/symbols";
import {
  ToolbarExpandingButton,
  ToolbarExpandingButtonIconWrap
} from "./toolbar-expanding-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FileType } from "@internote/export-service/types";

const HiddenFileInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

const FileInputLabel = styled.label`
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Container = styled(CollapseWidthOnHover)`
  position: relative;
`;

const attachments = makeAttachmentsApi({
  region: env.SERVICES_REGION,
  bucketName: env.ATTACHMENTS_BUCKET_NAME
});

export function getFileTypeFromFile(file: File): FileType {
  switch (file.type) {
    case "audio/mp3":
      return "audio";
    case "video/mp4":
      return "video";
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
      return "image";
    default:
      return "unknown";
  }
}

export interface InternoteUploadEvent {
  src: string;
  type: FileType;
  key: string;
  name: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const session = useTwineState(state => state.auth.session);
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file: File =
        fileInputRef.current &&
        fileInputRef.current.files &&
        fileInputRef.current.files.length > 0
          ? fileInputRef.current.files[0]
          : undefined;
      if (file) {
        setIsUploading(true);
        const type = getFileTypeFromFile(file);
        const src = attachments.getUploadLocation(session, noteId, file);
        const key = attachments.getUploadKey(session, noteId, file);
        const uploadStartEvent = {
          src,
          key,
          type,
          name: file.name,
          progress: 0,
          uploaded: false
        };
        onUploadStarted(uploadStartEvent);
        uploadSignal.dispatch(uploadStartEvent);
        await attachments.upload(session, noteId, file, progress => {
          const percentage = (progress.loaded / progress.total) * 100;
          const uploadProgressEvent = {
            src,
            key,
            type,
            name: file.name,
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
          key,
          type,
          name: file.name,
          progress: 100,
          uploaded: true
        };
        if (onUploadFinished) {
          onUploadFinished(uploadFinishedEvent);
        }
        uploadSignal.dispatch(uploadFinishedEvent);
        setIsUploading(false);
      }
    },
    [fileInputRef.current]
  );
  return (
    <>
      <Container
        forceShow={isUploading}
        collapsedContent={
          <Flex pl={spacing._0_25} style={{ whiteSpace: "nowrap" }}>
            Upload file
          </Flex>
        }
      >
        {collapse => (
          <ToolbarExpandingButton forceShow={isUploading}>
            <ToolbarExpandingButtonIconWrap>
              {isUploading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faUpload} />
              )}
            </ToolbarExpandingButtonIconWrap>
            {collapse.renderCollapsedContent()}

            <HiddenFileInput
              type="file"
              ref={fileInputRef}
              onChange={onSubmit}
              id="upload-file"
            />
            <FileInputLabel htmlFor="upload-file"></FileInputLabel>
          </ToolbarExpandingButton>
        )}
      </Container>
    </>
  );
};
