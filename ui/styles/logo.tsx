import styled from "styled-components";
import { font, color } from "../theming/symbols";

export const Logo = styled.div<{ large?: boolean }>`
  font-weight: 900;
  font-family: "Inter UI", Helvetica, Arial, sans-serif;
  font-size: ${(props) => (props.large ? font._24.size : font._18.size)};
  line-height: ${(props) =>
    props.large ? font._24.lineHeight : font._18.lineHeight};
  color: ${color.jumbo};
  letter-spacing: 3px;
  background: linear-gradient(
    to right,
    ${color.cornFlower} 0%,
    ${color.blueRibbon} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
`;
