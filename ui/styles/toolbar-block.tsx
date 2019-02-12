import { styled } from "../theming/styled";
import { font, color, spacing } from "../theming/symbols";

export const ToolbarBlock = styled.div`
  display: inline-block;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  color: ${color.jumbo};
  margin-right: ${spacing._1};
`;
