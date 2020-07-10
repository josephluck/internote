import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

import { borderRadius, font, spacing } from "../theming/symbols";

interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  fullWidth?: boolean;
  small?: boolean;
  children: React.ReactNode;
  loading?: boolean;
}

const ButtonWrap = styled.button.withConfig({
  shouldForwardProp: (prop: React.ReactText, def) =>
    !([
      "primary",
      "secondary",
      "fullWidth",
      "small",
      "loading",
    ] as React.ReactText[]).includes(prop) && def(prop),
})<ButtonProps>`
  background: ${(props) =>
    props.primary
      ? props.theme.primaryButtonBackground
      : props.theme.secondaryButtonBackground};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  border-radius: ${borderRadius._6};
  outline: none;
  border: 0;
  padding: ${(props) =>
    props.small
      ? `${spacing._0_25} ${spacing._0_5}`
      : `${spacing._0_5} ${spacing._1}`};
  color: ${(props) =>
    props.primary
      ? props.theme.primaryButtonText
      : props.theme.secondaryButtonText};
  font-weight: bold;
  font-size: ${(props) => (props.small ? font._12.size : font._18.size)};
  line-height: ${(props) =>
    props.small ? font._12.lineHeight : font._18.lineHeight};
  cursor: ${(props) =>
    props.disabled
      ? "not-allowed"
      : props.onClick || props.type === "submit"
      ? "pointer"
      : "inherit"};
`;

const SpinnerIcon = styled.div<{ primary?: boolean; small?: boolean }>`
  display: inline-block;
  margin-right: ${spacing._0_5};
  color: ${(props) =>
    props.primary
      ? props.theme.primaryButtonText
      : props.theme.secondaryButtonText};
  opacity: 0.7;
  font-size: ${(props) => (props.small ? font._12.size : font._16.size)};
`;

export function Button(
  props: ButtonProps & React.HTMLProps<HTMLButtonElement>
) {
  return (
    <ButtonWrap {...(props as any)}>
      {props.loading ? (
        <SpinnerIcon primary={props.primary} small={props.small}>
          <FontAwesomeIcon icon={faSpinner} spin />
        </SpinnerIcon>
      ) : null}
      {props.children}
    </ButtonWrap>
  );
}
