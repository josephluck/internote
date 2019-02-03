import styled from "styled-components";
import { color, borderRadius, spacing, font } from "./theme";

export const Input = styled.input`
  background: ${color.balticSea};
  width: 100%;
  border-radius: ${borderRadius._6};
  outline: none;
  border: 0;
  padding: ${spacing._0_25} ${spacing._0_5};
  color: white;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;

export const InputLabel = styled.label`
  display: inline-block;
  text-transform: uppercase;
  font-weight: bold;
  color: ${color.jumbo};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  margin-bottom: ${spacing._0_25};
  letter-spacing: 1px;
`;
