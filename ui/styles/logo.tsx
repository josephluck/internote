import * as React from "react";
import styled from "styled-components";
import { font, color } from "../styles/theme";
import { Subscribe } from "../store";

const Box = styled.div`
  font-weight: bold;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  color: ${color.jumbo};
  letter-spacing: 3px;
  background: linear-gradient(
    to right,
    ${color.cornFlower} 0%,
    ${color.blueRibbon} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export function Logo() {
  return (
    <Subscribe>
      {store => <Box>INTERNOTE {store.state.loading.toString()}</Box>}
    </Subscribe>
  );
}
