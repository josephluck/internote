import { font, spacing, borderRadius } from "../theming/symbols";
import { styled } from "../theming/styled";

export const ToolbarExpandingButton = styled.div<{ forceShow: boolean }>`
  display: inline-flex;
  align-items: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  border-radius: ${borderRadius._6};
  padding: ${spacing._0_25};
  color: ${props =>
    props.forceShow
      ? props.theme.expandingIconButtonActiveText
      : props.theme.expandingIconButtonInactiveText};
  background: ${props =>
    props.forceShow
      ? props.theme.expandingIconButtonBackground
      : "transparent"};
  &:hover {
    color: ${props => props.theme.expandingIconButtonActiveText};
    background: ${props => props.theme.expandingIconButtonBackground};
  }
`;

export const ToolbarExpandingButtonIconWrap = styled.div`
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  cursor: pointer;
  display: flex;
  align-items: center;
`;