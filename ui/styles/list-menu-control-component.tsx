import React from "react";
import { Collapse } from "react-collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenuItem, DropdownMenuSpacer } from "./dropdown-menu";
import Motion, { Move } from "@element-motion/core";
import { Shortcut } from "./shortcuts";
import { shortcutPriorities } from "../utilities/shortcuts";

interface RenderProps {
  toMainMenu: () => void;
  toSubMenu: (subMenu: string) => void;
}

interface MenuItem {
  title?: string;
  subMenu?: (menu: RenderProps) => React.ReactNode;
  item: (menu: RenderProps) => React.ReactNode;
  spacerAfter?: boolean;
  shortcut?: string;
}

export interface Props {
  items: MenuItem[];
  onSubMenuToggled?: (showing: boolean) => void;
  shortcutsEnabled?: boolean;
}

// TODO: support up/down/right/enter to navigate menu
// (left and esc are already supported)

export function Component({
  items,
  shortcutsEnabled = true,
  onSubMenuToggled
}: Props) {
  const [subMenu, setSubMenu] = React.useState<null | string>(null);
  const renderProps: RenderProps = {
    toSubMenu: (s: string) => setSubMenu(s),
    toMainMenu: () => setSubMenu(null)
  };

  React.useEffect(() => {
    if (onSubMenuToggled) {
      onSubMenuToggled(!!subMenu);
    }
  }, [subMenu]);

  const subMenuItem = subMenu
    ? items.find(item => item.title === subMenu)
    : null;

  return (
    <Collapse isOpened>
      {subMenuItem && subMenuItem.subMenu ? (
        <>
          <Shortcut
            id="back-to-main-menu"
            description="Back to main menu"
            keyCombo={["esc", "left"]}
            callback={() => setSubMenu(null)}
            priority={shortcutPriorities.listMenuBack}
            preventOtherShortcuts={true}
          />
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
        </>
      ) : (
        <div>
          {items.map((item, i) => (
            <Motion key={item.title || i} name={`item-${item.title}`}>
              <Move scaleY={false}>
                {motion => (
                  <div {...motion}>
                    {item.item(renderProps)}
                    {item.spacerAfter ? <DropdownMenuSpacer /> : null}
                    {item.shortcut && shortcutsEnabled ? (
                      <Shortcut
                        id={`open-menu-item-${item.title}-${item.shortcut}`}
                        description={`Open ${item.title.toLowerCase()}`}
                        keyCombo={item.shortcut}
                        callback={() => {
                          renderProps.toSubMenu(item.title);
                        }}
                        preventOtherShortcuts={true}
                        priority={shortcutPriorities.listMenuCategory}
                      />
                    ) : null}
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
