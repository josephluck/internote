import React from "react";

import { borderRadius, spacing, font } from "../theming/symbols";
import { Flex } from "@rebass/grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
import { sansSerif } from "../theming/themes";
import styled from "styled-components";

const UnknownFileWrap = styled.div`
  background: ${(props) => props.theme.toolbarBackground}; // TODO: own theme
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
  color: ${(props) => props.theme.toolbarButtonInactiveText}; // TODO: own theme
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
  color: ${(props) => props.theme.toolbarButtonInactiveText}; // TODO: own theme
  font-size: ${font._24.size};
  display: flex;
  margin-right: ${spacing._0_5};
`;

const DownloadIcon = styled.div`
  cursor: pointer;
  font-size: ${font._18.size};
  margin-left: ${spacing._1};
  color: ${(props) => props.theme.toolbarButtonInactiveText}; // TODO: own theme
  transition: color 300ms ease;
  display: flex;
  &:hover {
    color: ${(props) => props.theme.toolbarButtonActiveText}; // TODO: own theme
  }
`;

export function UnknownFile({
  extension,
  name,
  onDownloadFile,
}: {
  extension: string;
  name: string;
  onDownloadFile: () => void;
}) {
  return (
    <UnknownFileWrap>
      <Flex flex={1} alignItems="center" style={{ marginBottom: spacing._0_5 }}>
        {extension ? (
          <UnknownFileExtensionWrap>
            <FileIcon>
              <FontAwesomeIcon icon={faFile} />{" "}
            </FileIcon>
            <UnknownFileExtension>.{extension}</UnknownFileExtension>
          </UnknownFileExtensionWrap>
        ) : null}
        <Flex flex={1} />
        <DownloadIcon onClick={onDownloadFile}>
          <FontAwesomeIcon icon={faDownload} />
        </DownloadIcon>
      </Flex>
      <UnknownFileName>{name}</UnknownFileName>
    </UnknownFileWrap>
  );
}
