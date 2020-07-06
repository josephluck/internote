import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { sansSerif } from "../theming/themes";

const ProgressSvgCircle = styled.circle`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;

const ProgressCircleWrapper = styled.div`
  display: inline-flex;
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

export function ProgressCircle({
  progress,
  size = 18,
  stroke = 3,
  showPercentage = true,
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
    if (circleRef.current) {
      const radius = circleRef.current.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - (percentage / 100) * circumference;
      circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
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
