import styled from "styled-components";
import styledTs from "styled-components-ts";
import { font, color } from "../styles/theme";

export const Logo = styledTs<{ large?: boolean }>(styled.div)`
  font-weight: bold;
  font-size: ${props => (props.large ? font._24.size : font._18.size)};
  line-height: ${props =>
    props.large ? font._24.lineHeight : font._18.lineHeight};
  color: ${color.jumbo};
  letter-spacing: 3px;
  background: linear-gradient(
    to right,
    ${color.cornFlower} 0%,
    ${color.blueRibbon} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
`;
