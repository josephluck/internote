import { styled } from "../theming/styled";
import { font, spacing, borderRadius } from "../theming/symbols";

export const Tag = styled.div<{ isFocused: boolean }>`
  display: inline-flex;
  align-items: center;
  margin-right: ${spacing._0_125};
  margin-bottom: ${spacing._0_125};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  border-radius: ${borderRadius.pill};
  padding: ${spacing._0_25} ${spacing._0_4};
  color: ${props =>
    props.isFocused ? props.theme.tagActiveText : props.theme.tagText};
  background: ${props => props.theme.tagBackground};
  transition: all 300ms ease;
  cursor: pointer;
  white-space: nowrap;
  opacity: ${props => (props.isFocused ? 1 : 0.4)};
  transition: all 333ms ease;
  &:hover {
    color: ${props => props.theme.tagActiveText};
  }
`;

export const NewTag = styled(Tag)`
  padding: ${spacing._0_2} ${spacing._0_4};
  border: ${spacing._0_05} dotted ${props => props.theme.tagNewBorder};
  background: transparent;
`;
