import { styled } from "../theming/styled";
import { font, borderRadius, spacing } from "../theming/symbols";

export const BaseGhostElement = styled.div`
  border-radius: ${borderRadius._4};
  padding: ${spacing._0_25};
  color: ${props => props.theme.thesaurasWordText};
  background: ${props => props.theme.thesaurasWordBackground};
  height: ${font._16.size};
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
`;

export const HeadingTwo = styled.h2`
  font-size: ${font._28.size};
  line-height: ${font._28.lineHeight};
  font-weight: bold;
`;

export const GhostHeadingTwo = styled(BaseGhostElement)`
  height: ${font._28.lineHeight};
  padding: 0;
`;
