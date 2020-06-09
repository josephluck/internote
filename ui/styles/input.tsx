import React from "react";
import styled from "styled-components";
import { borderRadius, spacing, font } from "../theming/symbols";
import { InputHTMLAttributes, useState, useCallback } from "react";

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

export const InputLabel = styled.label<{ isFocused?: boolean }>`
  display: inline-block;
  text-transform: uppercase;
  font-weight: bold;
  color: ${(props) =>
    props.isFocused
      ? props.theme.inputLabelTextFocused
      : props.theme.inputLabelText};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  margin-bottom: ${spacing._0_25};
  letter-spacing: 1px;
  transition: color 100ms ease;
`;

const InputWithLabelContainer = styled.div``;

export function InputWithLabel({
  label,
  className,
  onFocus,
  onBlur,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    onFocus(e);
  }, []);
  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    onBlur(e);
  }, []);
  return (
    <InputWithLabelContainer className={className}>
      <InputLabel isFocused={isFocused}>{label}</InputLabel>
      <Input {...props} onFocus={handleFocus} onBlur={handleBlur} />
    </InputWithLabelContainer>
  );
}
