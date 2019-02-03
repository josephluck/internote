import styled from "styled-components";
import { media, spacing } from "./theme";

export const Wrapper = styled.div`
  padding-left: ${spacing._1};
  padding-right: ${spacing._1};
  margin: 0 auto;
  max-width: 42rem;
  opacity: 1;
  @media (min-width: ${media.tablet}) {
    padding-left: ${spacing._2};
    padding-right: ${spacing._2};
  }
`;
