import { useState, useEffect, useRef } from "react";
import { uploadSignal, FileType } from "./file-upload";
import { RenderBlockProps } from "slate-react";
import { makeAttachmentsApi } from "../api/attachments";
import { env } from "../env";
import { useTwineState } from "../store";
import styled from "styled-components";
import { borderRadius, spacing, font } from "../theming/symbols";
import { BaseGhostElement } from "./typography";
import { sansSerif } from "../theming/themes";

const attachments = makeAttachmentsApi({
  region: env.SERVICES_REGION,
  bucketName: env.ATTACHMENTS_BUCKET_NAME
});

const Img = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: ${borderRadius._4};
`;

const UploadingWrapper = styled.div`
  padding: ${spacing._1} 0;
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0;
  line-height: 0;
`;

const UploadingText = styled.div`
  position: relative;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  font-weight: bold;
  font-family: ${sansSerif.fontFamily};
  margin-left: ${spacing._0_5};
`;

const UploadingBackground = styled(BaseGhostElement)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
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
    return <div>Unknown file: {name}</div>;
  }

  return (
    <UploadingWrapper>
      <UploadingBackground />
      <ProgressCircle progress={uploadProgress} showPercentage />
      <UploadingText>Uploading</UploadingText>
    </UploadingWrapper>
  );
}

const ProgressSvgCircle = styled.circle`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;

const ProgressCircleWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const ProgressPercentage = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  transform: translateX(-50%) translateY(-50%);
  font-size: 8px;
  line-height: 8px;
  font-weight: bold;
  font-family: ${sansSerif.fontFamily};
`;

function ProgressCircle({
  progress,
  size = 18,
  stroke = 3,
  showPercentage = true
}: {
  progress: number;
  size?: number;
  stroke?: number;
  showPercentage?: boolean;
}) {
  const ringRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const percentage = Math.ceil(progress);

  useEffect(() => {
    const radius = circleRef.current.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
    circleRef.current.style.strokeDashoffset = `${offset}`;
  }, [percentage, ringRef.current, circleRef.current]);

  return (
    <ProgressCircleWrapper>
      <svg ref={ringRef} width={size * 2} height={size * 2}>
        <ProgressSvgCircle
          ref={circleRef}
          stroke="white"
          strokeWidth={stroke}
          fill="transparent"
          r={size - stroke}
          cx={size}
          cy={size}
        />
      </svg>
      {showPercentage ? (
        <ProgressPercentage>{percentage}%</ProgressPercentage>
      ) : null}
    </ProgressCircleWrapper>
  );
}
