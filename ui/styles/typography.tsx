import { styled } from "../theming/styled";

export const Typography = styled.span`
  font-weight: ${(props: any) => (props.bold ? "bold" : "normal")};
`;
