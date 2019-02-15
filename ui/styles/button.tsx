import { styled } from "../theming/styled";
import { borderRadius, spacing, font } from "../theming/symbols";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  fullWidth?: boolean;
  small?: boolean;
  children: React.ReactNode;
  loading?: boolean;
}

const ButtonWrap = styled.button<ButtonProps>`
  background: ${props =>
    props.primary
      ? props.theme.primaryButtonBackground
      : props.theme.secondaryButtonBackground};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${props => (props.fullWidth ? "100%" : "auto")};
  border-radius: ${borderRadius._6};
  outline: none;
  border: 0;
  padding: ${props =>
    props.small
      ? `${spacing._0_25} ${spacing._0_5}`
      : `${spacing._0_5} ${spacing._1}`};
  color: ${props =>
    props.primary
      ? props.theme.primaryButtonText
      : props.theme.secondaryButtonText};
  font-weight: bold;
  font-size: ${props => (props.small ? font._12.size : font._18.size)};
  line-height: ${props =>
    props.small ? font._12.lineHeight : font._18.lineHeight};
  cursor: ${props =>
    props.onClick || props.type === "submit" ? "pointer" : "inherit"};
`;

const SpinnerIcon = styled.div<{ primary?: boolean; small?: boolean }>`
  display: inline-block;
  margin-right: ${spacing._0_5};
  color: ${props =>
    props.primary
      ? props.theme.primaryButtonText
      : props.theme.secondaryButtonText};
  opacity: 0.7;
  font-size: ${props => (props.small ? font._12.size : font._16.size)};
`;

export function Button(
  props: ButtonProps & React.HTMLProps<HTMLButtonElement>
) {
  return (
    <ButtonWrap {...props as any}>
      {props.loading ? (
        <SpinnerIcon primary={props.primary} small={props.small}>
          <FontAwesomeIcon icon={faSpinner} spin />
        </SpinnerIcon>
      ) : null}
      {props.children}
    </ButtonWrap>
  );
}

export const RoundButton = styled.button<{ isActive: boolean }>`
  background: ${props =>
    props.isActive
      ? props.theme.formatButtonActiveBackground
      : props.theme.formatButtonInactiveBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius._6};
  outline: none;
  border: 0;
  padding: 0;
  color: ${props =>
    props.isActive
      ? props.theme.formatButtonActiveText
      : props.theme.formatButtonInactiveText};
  font-weight: ${props => (props.isActive ? "bold" : "normal")};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  padding: ${spacing._0_25};
  overflow: hidden;
  transition: all 300ms ease;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: ${props => props.formatButtonActiveText};
  }
`;
