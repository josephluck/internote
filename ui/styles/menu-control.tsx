import * as React from "react";
import { OnClickOutside } from "./on-click-outside";
import styled from "styled-components";
import { Shortcut } from "./shortcuts";

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
  menuName,
  className,
  onClose,
  onMenuToggled,
  disableCloseShortcut = false
}: {
  children: (state: RenderProps) => React.ReactNode;
  menu: (state: RenderProps) => React.ReactNode;
  menuName: string;
  className?: string;
  onClose?: () => any;
  onMenuToggled?: (menuShowing: boolean) => void;
  disableCloseShortcut?: boolean;
}) {
  const [menuShowing, setMenuShowing] = React.useState(false);

  function handleClose() {
    setMenuShowing(false);
    if (onClose) {
      onClose();
    }
    if (onMenuToggled) {
      onMenuToggled(false);
    }
  }

  function toggleMenuShowing(showing: boolean) {
    setMenuShowing(showing);
    if (onMenuToggled) {
      onMenuToggled(showing);
    }
  }

  const renderProps: RenderProps = {
    menuShowing,
    toggleMenuShowing
  };
  return (
    <MenuWrapper className={className} onClickOutside={handleClose}>
      <Shortcut
        id={menuName
          .split(" ")
          .join("-")
          .toLowerCase()}
        description={`Close ${menuName.toLowerCase()}`}
        disabled={disableCloseShortcut}
        keyCombo="esc"
        callback={handleClose}
      />
      {menu(renderProps)}
      {children(renderProps)}
    </MenuWrapper>
  );
}
