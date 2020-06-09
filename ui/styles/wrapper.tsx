import styled, { css } from "styled-components";
import { media, spacing, size } from "../theming/symbols";

export const wrapperStyles = css`
  padding-left: ${spacing._1};
  padding-right: ${spacing._1};
  margin: 0 auto;
  max-width: ${size.wrapperMaxWidth};
  opacity: 1;
  @media (min-width: ${media.tablet}) {
    padding-left: ${spacing._2};
    padding-right: ${spacing._2};
  }
`;

export const Wrapper = styled.div`
  ${wrapperStyles}
`;
