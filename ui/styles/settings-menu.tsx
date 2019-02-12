import { Store } from "../store";
import { MenuControl } from "./menu-control";
import {
  faCog,
  faSignOutAlt,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, DropdownMenuItem } from "./dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { RoundButton } from "./button";

const Menu = styled(MenuControl)`
  display: flex;
`;

export function SettingsMenu({ store }: { store: Store }) {
  return (
    <Menu
      menu={menu => (
        <DropdownMenu showing={menu.menuShowing} position="right">
          <DropdownMenuItem
            icon={faSignOutAlt}
            onClick={() => {
              store.actions.signOutConfirmation();
              menu.toggleMenuShowing(false);
            }}
          >
            Sign out
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={faTrash}
            onClick={() => {
              store.actions.deleteAccountConfirmation();
              menu.toggleMenuShowing(false);
            }}
          >
            Delete account
          </DropdownMenuItem>
        </DropdownMenu>
      )}
    >
      {menu => (
        <RoundButton
          isActive={false}
          onClick={() => menu.toggleMenuShowing(!menu.showing)}
        >
          <FontAwesomeIcon icon={faCog} />
        </RoundButton>
      )}
    </Menu>
  );
}
