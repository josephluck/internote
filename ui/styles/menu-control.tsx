import * as React from "react";
import { OnClickOutside } from "./on-click-outside";
import styled from "styled-components";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";

const MenuWrapper = styled(OnClickOutside)`
  position: relative;
`;

export type ChildProps = {
  toggleMenuShowing: (menuShowing: boolean) => void;
} & State;

interface Props {
  children: (state: ChildProps) => React.ReactNode;
  menu: (state: ChildProps) => React.ReactNode;
  className?: string;
  onClose?: () => any;
  onMenuToggled?: (menuShowing: boolean) => void;
}

interface State {
  menuShowing: boolean;
}

export class MenuControl extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      menuShowing: false
    };
  }

  toggleMenuShowing = (menuShowing: boolean) => {
    if (this.props.onMenuToggled && this.state.menuShowing !== menuShowing) {
      this.props.onMenuToggled(menuShowing);
    }
    this.setState({ menuShowing });
  };

  onClose = () => {
    this.toggleMenuShowing(false);
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { className = "", children, menu } = this.props;
    const childProps = {
      ...this.state,
      toggleMenuShowing: this.toggleMenuShowing
    };
    return (
      <MenuWrapper className={className} onClickOutside={this.onClose}>
        <OnKeyboardShortcut keyCombo="esc" cb={this.onClose} />
        {menu(childProps)}
        {children(childProps)}
      </MenuWrapper>
    );
  }
}
