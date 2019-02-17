import * as React from "react";
import { spacing, font, borderRadius } from "../theming/symbols";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { styled } from "../theming/styled";

const ExpandingIcon = styled.div`
  transition: all 260ms ease;
`;

const ExpandingButton = styled.div<{ forceShow: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius._6};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  overflow: hidden;
  padding: ${spacing._0_25};
  transition: all 300ms ease;
  color: ${props =>
    props.forceShow
      ? props.theme.expandingIconButtonActiveText
      : props.theme.expandingIconButtonInactiveText};
  background: ${props => props.theme.expandingIconButtonBackground};
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.expandingIconButtonActiveText};
  }
`;

const ExpandingText = styled.div`
  padding-left: ${spacing._0_25};
  font-weight: 600;
  white-space: nowrap;
`;

export function ExpandingIconButton({
  forceShow,
  onClick,
  icon,
  text
}: {
  forceShow: boolean;
  onClick: () => any;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <CollapseWidthOnHover
      forceShow={forceShow}
      collapsedContent={<ExpandingText>{text}</ExpandingText>}
    >
      {collapse => (
        <ExpandingButton forceShow={forceShow} onClick={onClick}>
          <ExpandingIcon>{icon}</ExpandingIcon>
          {collapse.renderCollapsedContent()}
        </ExpandingButton>
      )}
    </CollapseWidthOnHover>
  );
}
