import React from "react";
import { Editor as SlateEditor, EditorProps } from "slate-react";
import { styled } from "../theming/styled";
import { spacing } from "../theming/symbols";

export const StyledEditor = styled(SlateEditor)<{ distractionFree: boolean }>`
  padding-top: ${props => (props.distractionFree ? "50vh" : 0)};
  padding-bottom: ${props => (props.distractionFree ? "50vh" : spacing._1)};
  flex: 1;
`;

interface Props extends EditorProps {
  forwardedRef: any;
}

export class Editor extends React.Component<Props> {
  render() {
    const { forwardedRef, ...props } = this.props;
    return <StyledEditor ref={forwardedRef} {...props} />;
  }
}
