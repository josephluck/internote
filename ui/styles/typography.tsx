import styled from "styled-components";

export const Typography = styled.span`
  font-weight: ${(props: any) => (props.bold ? "bold" : "normal")};
`;
