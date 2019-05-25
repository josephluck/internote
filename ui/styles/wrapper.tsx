import { styled } from "../theming/styled";
import { media, spacing, size } from "../theming/symbols";

export const Wrapper = styled.div`
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

export const OutlineAdjacentWrapper = styled(Wrapper)`
  flex: 1;
  max-width: ${size.wrapperMaxWidthOutline};
`;
