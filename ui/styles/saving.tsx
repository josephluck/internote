import styled, { keyframes, css } from "styled-components";

const bounce = keyframes`
  0% {
    transform: scale(0.8, 0.8);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.2, 1.2);
    opacity: 1;
  }

  100% {
    transform: scale(0.8, 0.8);
    opacity: 0.7;
  }
`;

export const Saving = styled.div<{ saving: boolean }>`
  animation: ${(props) =>
    props.saving
      ? css`
          ${bounce} 1.5s ease infinite
        `
      : ""};
  transition: all 300ms ease;
  height: 10px;
  width: 10px;
  border-radius: 9999px;
  background: ${(props) =>
    props.saving ? "transparent" : props.theme.savingInactive};
  border: solid 2px
    ${(props) =>
      props.saving ? props.theme.savingActive : props.theme.savingInactive};
`;
