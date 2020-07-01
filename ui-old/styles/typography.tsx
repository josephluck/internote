import styled, { keyframes } from "styled-components";

import { borderRadius, font, spacing } from "../theming/symbols";

const ghostPulse = keyframes`
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }

  to {
    opacity: 1;
  }
`;

export const BaseGhostElement = styled.div`
  border-radius: ${borderRadius._4};
  padding: ${spacing._0_25};
  color: ${(props) => props.theme.tagText};
  background: ${(props) => props.theme.tagBackground};
  height: ${font._16.size};
  animation: ${ghostPulse} 2s ease-in-out infinite;
`;

export const Typography = styled.span`
  font-weight: ${(props: any) => (props.bold ? "bold" : "normal")};
`;

export const HeadingOne = styled.h1`
  font-size: ${font._36.size};
  line-height: ${font._36.lineHeight};
  font-weight: bold;
`;

export const GhostHeadingOne = styled(BaseGhostElement)`
  height: ${font._36.lineHeight};
  padding: 0;
  width: 200px;
`;

export const HeadingTwo = styled.h2`
  font-size: ${font._28.size};
  line-height: ${font._28.lineHeight};
  font-weight: bold;
`;

export const GhostHeadingTwo = styled(BaseGhostElement)`
  height: ${font._28.lineHeight};
  padding: 0;
  width: 160px;
`;
