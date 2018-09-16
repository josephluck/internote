import styled from "styled-components";
import { font, color } from "../styles/theme";

const Box = styled.div`
  font-weight: bold;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  color: ${color.jumbo};
  letter-spacing: 3px;
`;

export function Logo() {
  return <Box>INTERNOTE</Box>;
}
