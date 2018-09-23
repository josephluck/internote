import styled from "styled-components";
import styledTs from "styled-components-ts";
import { color, borderRadius, spacing, font } from "./theme";

export const Button = styledTs<{
  primary?: boolean;
  secondary?: boolean;
  fullWidth?: boolean;
  small?: boolean;
}>(styled.button)`
  background: ${props => (props.primary ? color.blueRibbon : color.balticSea)};
  display: inline-block;
  width: ${props => (props.fullWidth ? "100%" : "auto")};
  border-radius: ${borderRadius._6};
  outline: none;
  border: 0;
  padding: ${props =>
    props.small
      ? `${spacing._0_25} ${spacing._0_5}`
      : `${spacing._0_5} ${spacing._1}`};
  color: ${props => (props.primary ? "white" : color.iron)};
  font-weight: bold;
  text-transform: uppercase;
  font-size: ${props => (props.small ? font._12.size : font._18.size)};
  line-height: ${props =>
    props.small ? font._12.lineHeight : font._18.lineHeight};
`;
