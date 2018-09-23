import styled from "styled-components";
import styledTs from "styled-components-ts";
import { color, borderRadius, spacing, font } from "./theme";

export const Button = styledTs<{
  primary?: boolean;
  secondary?: boolean;
  fullWidth?: boolean;
}>(styled.button)`
  background: ${props => (props.primary ? color.blueRibbon : color.balticSea)};
  display: inline-block;
  width: ${props => (props.fullWidth ? "100%" : "auto")};
  border-radius: ${borderRadius._6};
  outline: none;
  border: 0;
  padding: ${spacing._0_5} ${spacing._1};
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;
