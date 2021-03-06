import React from "react";
import styled from "styled-components";

import { OnClickOutside } from "./on-click-outside";
import { Shortcut } from "./shortcuts";

const MenuWrapper = styled(OnClickOutside)`
  position: relative;
`;

export type RenderProps = {
  toggleMenuShowing: (menuShowing: boolean) => void;
} & State;

interface State {
  menuShowing?: boolean;
}

export function MenuControl({
  children,
  menu,
  menuName,
  className,
  onClose,
  onMenuToggled,
  disableCloseShortcut = false,
  forceShow = false,
}: {
  children: (state: RenderProps) => React.ReactNode;
  menu: (state: RenderProps) => React.ReactNode;
  menuName: string;
  className?: string;
  onClose?: () => any;
  onMenuToggled?: (menuShowing: boolean) => void;
  disableCloseShortcut?: boolean;
  forceShow?: boolean;
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
    menuShowing: menuShowing || forceShow,
    toggleMenuShowing,
  };

  return (
    <MenuWrapper className={className} onClickOutside={handleClose}>
      {menuShowing || forceShow ? (
        <Shortcut
          id={menuName.split(" ").join("-").toLowerCase()}
          description={`Close ${menuName.toLowerCase()}`}
          disabled={disableCloseShortcut}
          keyCombo="esc"
          callback={handleClose}
        />
      ) : null}
      {menu(renderProps)}
      {children(renderProps)}
    </MenuWrapper>
  );
}
