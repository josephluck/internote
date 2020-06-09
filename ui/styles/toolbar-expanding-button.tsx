import { font, spacing, borderRadius } from "../theming/symbols";
import styled from "styled-components";

export const ToolbarExpandingButton = styled.div<{
  forceShow?: boolean;
  isActive?: boolean;
}>`
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  border-radius: ${borderRadius._6};
  padding: ${spacing._0_25};
  height: ${spacing._1};
  font-weight: 600;
  color: ${(props) =>
    props.isActive
      ? props.theme.toolbarButtonActiveText
      : props.forceShow
      ? props.theme.expandingIconButtonActiveText
      : props.theme.expandingIconButtonInactiveText};
  background: ${(props) =>
    props.isActive
      ? props.theme.toolbarButtonActiveBackground
      : props.forceShow
      ? props.theme.expandingIconButtonBackground
      : "transparent"};
  &:hover {
    color: ${(props) =>
      props.isActive
        ? props.theme.toolbarButtonActiveText
        : props.theme.expandingIconButtonActiveText};
    background: ${(props) =>
      props.isActive
        ? props.theme.toolbarButtonActiveBackground
        : props.theme.expandingIconButtonBackground};
  }
`;

export const ToolbarExpandingButtonIconWrap = styled.div`
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  cursor: pointer;
  display: flex;
  align-items: center;
`;
