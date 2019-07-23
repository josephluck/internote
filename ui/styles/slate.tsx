import { Editor as SlateEditor } from "slate-react";
import { styled } from "../theming/styled";
import { spacing } from "../theming/symbols";

export const Editor = styled(SlateEditor)<{ distractionFree: boolean }>`
  padding-top: ${props => (props.distractionFree ? "50vh" : 0)};
  padding-bottom: ${props => (props.distractionFree ? "50vh" : spacing._1)};
  flex: 1;
`;
