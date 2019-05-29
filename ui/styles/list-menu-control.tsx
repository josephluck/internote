import * as React from "react";
import { Collapse } from "react-collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenuItem, DropdownMenuSpacer } from "./dropdown-menu";

interface RenderProps {
  toMainMenu: () => void;
  toSubMenu: (subMenu: string) => void;
}

interface MenuItem {
  title?: string;
  subMenu?: (menu: RenderProps) => React.ReactNode;
  item: (menu: RenderProps) => React.ReactNode;
  spacerAfter?: boolean;
}

export function ListMenuControl({ items }: { items: MenuItem[] }) {
  const [subMenu, setSubMenu] = React.useState<null | string>(null);
  const renderProps: RenderProps = {
    toSubMenu: (s: string) => setSubMenu(s),
    toMainMenu: () => setSubMenu(null)
  };
  const subMenuItem = subMenu
    ? items.find(item => item.title === subMenu)
    : null;
  return (
    <Collapse isOpened>
      {subMenuItem && subMenuItem.subMenu ? (
        <>
          <DropdownMenuItem
            onClick={() => setSubMenu(null)}
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
          >
            {subMenuItem.title}
          </DropdownMenuItem>
          <DropdownMenuSpacer />
          {subMenuItem.subMenu(renderProps)}
        </>
      ) : (
        <div>
          {items.map((item, i) => (
            <div key={item.title || i}>
              {item.item(renderProps)}
              {item.spacerAfter ? <DropdownMenuSpacer /> : null}
            </div>
          ))}
        </div>
      )}
    </Collapse>
  );
}
