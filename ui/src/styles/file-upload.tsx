import { faSpinner, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@rebass/grid";
import React, { FormEvent, useCallback, useRef, useState } from "react";
import { Signal } from "signals";
import styled from "styled-components";

import { api } from "../api";
import { useStately } from "../store/store";
import { spacing } from "../theming/symbols";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";

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

export function getFileTypeFromFile(file: File): any {
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
      return "unknown-file";
  }
}

export interface InternoteUploadEvent {
  src: string;
  type: any;
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
  onUploadFinished,
}: {
  noteId: string;
  onUploadStarted: (e: InternoteUploadEvent) => void;
  onUploadProgress?: (e: InternoteUploadEvent) => void;
  onUploadFinished?: (e: InternoteUploadEvent) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const session = useStately((state) => state.auth.session);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLInputElement>) => {
      e.preventDefault();

      const file: File | undefined =
        fileInputRef.current &&
        fileInputRef.current.files &&
        fileInputRef.current.files.length > 0
          ? fileInputRef.current.files[0]
          : undefined;

      if (file) {
        setIsUploading(true);

        const type = getFileTypeFromFile(file);

        const src = api.attachments.getUploadLocation(session, noteId, file);

        const key = api.attachments.getUploadKey(session, noteId, file);

        const uploadStartEvent = {
          src,
          key,
          type,
          name: file.name,
          progress: 0,
          uploaded: false,
        };

        onUploadStarted(uploadStartEvent);

        uploadSignal.dispatch(uploadStartEvent);

        await api.attachments.upload(session, noteId, file, (progress) => {
          const percentage = (progress.loaded / progress.total) * 100;
          const uploadProgressEvent = {
            src,
            key,
            type,
            name: file.name,
            progress: percentage,
            uploaded: false,
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
          uploaded: true,
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
        {(collapse) => (
          <div>
            <div>
              {isUploading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faUpload} />
              )}
            </div>
            {collapse.renderCollapsedContent()}

            <HiddenFileInput
              type="file"
              ref={fileInputRef}
              onChange={onSubmit}
              id="upload-file"
            />
            <FileInputLabel htmlFor="upload-file"></FileInputLabel>
          </div>
        )}
      </Container>
    </>
  );
};
