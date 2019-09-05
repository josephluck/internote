import React from "react";
import styled from "styled-components";
import { borderRadius, spacing, font } from "../theming/symbols";
import { sansSerif } from "../theming/themes";

const UploadingWrapper = styled.div`
  background: ${props => props.theme.toolbarBackground};
  border-radius: ${borderRadius._4};
  padding: ${spacing._1} ${spacing._1} ${spacing._2};
  font-family: ${sansSerif.fontFamily};
  position: relative;
  max-width: 400px;
`;

const UploadingText = styled.span`
  margin-bottom: ${spacing._0_5};
  display: block;
  position: relative;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;

const Percentage = styled.span`
  display: block;
  position: relative;
  font-size: ${font._16.size};
  line-height: ${font._16.lineHeight};
  font-weight: bold;
  color: ${props => props.theme.toolbarButtonInactiveText};
`;

export function Uploading({
  name,
  progress
}: {
  name: string;
  progress: number;
}) {
  const percentage = Math.ceil(progress);
  return (
    <UploadingWrapper>
      <ProgressBar progress={percentage} />
      <UploadingText>Uploading {name}</UploadingText>
      <Percentage>{percentage}%</Percentage>
    </UploadingWrapper>
  );
}

const ProgressContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  left: 0;
`;

const ProgressIndication = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  padding-bottom: ${spacing._2};
  transition: width 100ms ease;
`;

const ProgressLine = styled.div`
  height: 2px;
  background: rgba(9, 94, 253, 1);
  position: absolute;
  bottom: ${spacing._1};
  left: 0;
  width: 100%;
`;

function ProgressBar({ progress }: { progress: number }) {
  return (
    <ProgressContainer>
      <ProgressIndication style={{ width: `${progress}%` }}>
        <ProgressLine />
      </ProgressIndication>
    </ProgressContainer>
  );
}
