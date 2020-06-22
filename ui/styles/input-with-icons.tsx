import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

import { borderRadius, font, spacing } from "../theming/symbols";

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${font._12.size};
  color: ${(props) => props.theme.dropdownMenuItemText};
  transition: all 300ms ease;
`;

const SearchIcon = styled(InputIcon)`
  left: ${spacing._0_75};
  pointer-events: none;
`;

const ClearIcon = styled(InputIcon)<{ isShowing: boolean }>`
  right: ${spacing._0_75};
  pointer-events: ${(props) => (props.isShowing ? "initial" : "none")};
  cursor: ${(props) => (props.isShowing ? "pointer" : "default")};
  opacity: ${(props) => (props.isShowing ? 1 : 0)};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${spacing._0_5} ${spacing._0_5} ${spacing._0_5} ${spacing._1_75};
  border: 0;
  color: ${(props) => props.theme.searchInputText};
  font: inherit;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  outline: none;
  border-radius: ${borderRadius._4};
  transition: all 300ms ease;
  font-weight: 500;
`;

const SearchBoxWrapper = styled.div<{ isFocused: boolean }>`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  &:hover {
    ${SearchIcon} {
      opacity: 1;
    }
  }
  &:focus-within {
    ${SearchIcon} {
      opacity: 1;
    }
    ${SearchInput} {
      background: ${(props) => props.theme.searchInputFocusedBackground};
    }
  }
  ${SearchIcon} {
    opacity: ${(props) => (props.isFocused ? 1 : 0.7)};
  }
  ${SearchInput} {
    background: ${(props) =>
      props.isFocused
        ? props.theme.searchInputFocusedBackground
        : props.theme.searchInputBackground};
  }
`;

export function InputWithIcons({
  value,
  placeholder,
  isFocused,
  onClear,
  onChange,
  onFocus,
  onBlur,
  inputRef,
  leftIcon = faSearch,
}: {
  value: string;
  placeholder?: string;
  isFocused?: boolean;
  onClear?: () => any;
  onChange?: (e: any) => any;
  onFocus?: () => any;
  onBlur?: () => any;
  inputRef?: (ref: HTMLInputElement) => any;
  leftIcon?: IconProp;
}) {
  return (
    <SearchBoxWrapper isFocused={isFocused}>
      <SearchIcon>
        <FontAwesomeIcon icon={leftIcon} />
      </SearchIcon>
      <SearchInput
        placeholder={placeholder}
        ref={inputRef}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
      {onClear ? (
        <ClearIcon isShowing={isFocused} onClick={onClear}>
          <FontAwesomeIcon icon={faTimes} />
        </ClearIcon>
      ) : null}
    </SearchBoxWrapper>
  );
}
