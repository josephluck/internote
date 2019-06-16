import * as React from "react";
import { Collapse } from "react-collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenuItem, DropdownMenuSpacer } from "./dropdown-menu";
import Motion, { Move } from "@element-motion/core";

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

export interface Props {
  items: MenuItem[];
}

export function Component({ items }: Props) {
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
        <Motion name={`item-${subMenu}`}>
          <Move scaleY={false}>
            {motion => (
              <div {...motion}>
                <DropdownMenuItem
                  onClick={() => setSubMenu(null)}
                  icon={<FontAwesomeIcon icon={faChevronLeft} />}
                >
                  {subMenuItem.title}
                </DropdownMenuItem>
                <DropdownMenuSpacer />
                {subMenuItem.subMenu(renderProps)}
              </div>
            )}
          </Move>
        </Motion>
      ) : (
        <div>
          {items.map((item, i) => (
            <Motion key={item.title || i} name={`item-${item.title}`}>
              <Move scaleY={false}>
                {motion => (
                  <div {...motion}>
                    {item.item(renderProps)}
                    {item.spacerAfter ? <DropdownMenuSpacer /> : null}
                  </div>
                )}
              </Move>
            </Motion>
          ))}
        </div>
      )}
    </Collapse>
  );
}
