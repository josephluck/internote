import React from "react";
import { Editor as SlateEditor, EditorProps } from "slate-react";
import styled from "styled-components";
import { spacing } from "../theming/symbols";

const StyledEditor = styled(SlateEditor)<{ distractionFree: boolean }>`
  padding-top: ${(props) => (props.distractionFree ? "50vh" : 0)};
  padding-bottom: ${(props) => (props.distractionFree ? "50vh" : spacing._1)};
  flex: 1;
`;

export interface InternoteSlateEditorPropsWithRef extends EditorProps {
  forwardedRef: any;
  distractionFree: boolean;
}

export type InternoteSlateEditorProps = Omit<
  InternoteSlateEditorPropsWithRef,
  "forwardedRef"
>;

export class Editor extends React.Component<InternoteSlateEditorPropsWithRef> {
  render() {
    const { forwardedRef, ...props } = this.props;
    return <StyledEditor ref={forwardedRef} {...props} />;
  }
}
