import { Editor as SlateEditor, EditorProps } from "slate-react";
import { styled } from "../theming/styled";
import { spacing } from "../theming/symbols";

export const Styled = styled(SlateEditor)<{ distractionFree: boolean }>`
  padding-top: ${props => (props.distractionFree ? "50vh" : 0)};
  padding-bottom: ${props => (props.distractionFree ? "50vh" : spacing._1)};
  flex: 1;
`;

export const Editor = ({
  forwardedRef,
  ...props
}: EditorProps & { forwardedRef: any }) => (
  <Styled ref={forwardedRef} {...props} />
);
