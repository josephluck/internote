import * as React from "react";
import { OnClickOutside } from "./on-click-outside";
import styled from "styled-components";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";

const MenuWrapper = styled(OnClickOutside)`
  position: relative;
`;

export type RenderProps = {
  toggleMenuShowing: (menuShowing: boolean) => void;
} & State;

interface State {
  menuShowing: boolean;
}

export function MenuControl({
  children,
  menu,
  className,
  onClose,
  onMenuToggled
}: {
  children: (state: RenderProps) => React.ReactNode;
  menu: (state: RenderProps) => React.ReactNode;
  className?: string;
  onClose?: () => any;
  onMenuToggled?: (menuShowing: boolean) => void;
}) {
  const [menuShowing, setMenuShowing] = React.useState(false);

  function handleClose() {
    setMenuShowing(false);
    if (onClose) {
      onClose();
    }
  }

  function toggleMenuShowing(showing: boolean) {
    setMenuShowing(showing);
    if (onMenuToggled && menuShowing !== showing) {
      onMenuToggled(showing);
    }
  }

  const renderProps: RenderProps = {
    menuShowing,
    toggleMenuShowing
  };
  return (
    <MenuWrapper className={className} onClickOutside={handleClose}>
      <OnKeyboardShortcut keyCombo="esc" cb={handleClose} />
      {menu(renderProps)}
      {children(renderProps)}
    </MenuWrapper>
  );
}
