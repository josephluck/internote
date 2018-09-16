import styled from "styled-components";
import { font, color, spacing } from "./theme";

export const ToolbarBlock = styled.div`
  display: inline-block;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  color: ${color.jumbo};
  margin-right: ${spacing._2};
  font-weight: bold;
`;
