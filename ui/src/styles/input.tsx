import React from "react";
import { InputHTMLAttributes, useCallback, useState } from "react";
import styled from "styled-components";

import { borderRadius, font, spacing } from "../theming/symbols";

const InputWithLabelContainer = styled.div``;

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  touched?: boolean;
};

export function InputWithLabel({
  label,
  className,
  onFocus,
  onBlur,
  touched,
  error,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus]
  );
  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur]
  );
  return (
    <InputWithLabelContainer className={className}>
      <InputLabel isFocused={isFocused}>{label}</InputLabel>
      <Input {...props} onFocus={handleFocus} onBlur={handleBlur} />
      {touched && !!error ? <InputError>{error}</InputError> : null}
    </InputWithLabelContainer>
  );
}

const Label = styled.label<{ isFocused?: boolean }>`
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  margin-bottom: ${spacing._0_25};
  transition: color 100ms ease;
  display: block;
`;

export const InputLabel = styled(Label)`
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${(props) =>
    props.isFocused
      ? props.theme.inputLabelTextFocused
      : props.theme.inputLabelText};
`;

export const InputError = styled(Label)`
  margin-top: ${spacing._0_25};
  color: ${(props) => props.theme.inputErrorText};
`;

export const Input = styled.input`
  background: ${(props) => props.theme.inputBackground};
  width: 100%;
  border-radius: ${borderRadius._6};
  outline: none;
  border: 0;
  padding: ${spacing._0_25} ${spacing._0_5};
  color: ${(props) => props.theme.inputText};
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
`;
