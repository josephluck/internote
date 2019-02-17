import { Store } from "../store";
import { MenuControl } from "./menu-control";
import {
  faCog,
  faSignOutAlt,
  faTrash,
  faPalette,
  faCheck,
  faFont,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, DropdownMenuItem } from "./dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { size } from "../theming/symbols";
import { ListMenuControl } from "./list-menu-control";
import { ExpandingIconButton } from "./expanding-icon-button";

const SettingsMenuWrap = styled(DropdownMenu)`
  width: ${size.settingsMenuDropdownWidth};
`;

const Menu = styled(MenuControl)`
  display: flex;
`;

export function SettingsMenu({
  store,
  onMenuToggled
}: {
  store: Store;
  onMenuToggled: (menuShowing: boolean) => void;
}) {
  return (
    <Menu
      onMenuToggled={onMenuToggled}
      menu={menu => (
        <SettingsMenuWrap showing={menu.menuShowing} position="right">
          <OnKeyboardShortcut
            keyCombo="mod+s"
            cb={() => menu.toggleMenuShowing(true)}
          />
          <ListMenuControl
            items={[
              {
                title: "Colours",
                item: list => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faPalette} />}
                    onClick={() => {
                      list.toSubMenu("Colours");
                    }}
                  >
                    Colours
                  </DropdownMenuItem>
                ),
                subMenu: () => (
                  <>
                    {store.state.colorThemes.map(theme => (
                      <DropdownMenuItem
                        onClick={() => store.actions.setColorTheme(theme)}
                        icon={
                          theme.name === store.state.colorTheme.name ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : null
                        }
                      >
                        {theme.name}
                      </DropdownMenuItem>
                    ))}
                  </>
                )
              },
              {
                title: "Typography",
                item: list => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faFont} />}
                    onClick={() => {
                      list.toSubMenu("Typography");
                    }}
                  >
                    Typography
                  </DropdownMenuItem>
                ),
                subMenu: () => (
                  <>
                    {store.state.fontThemes.map(theme => (
                      <DropdownMenuItem
                        onClick={() => store.actions.setFontTheme(theme)}
                        icon={
                          theme.name === store.state.fontTheme.name ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : null
                        }
                      >
                        <span style={{ fontFamily: theme.theme.fontFamily }}>
                          {theme.name}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </>
                )
              },
              {
                title: "Focus mode",
                item: list => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => {
                      list.toSubMenu("Focus mode");
                    }}
                  >
                    Focus mode
                  </DropdownMenuItem>
                ),
                subMenu: () => (
                  <>
                    <DropdownMenuItem
                      onClick={() => store.actions.setDistractionFree(false)}
                      icon={
                        !store.state.distractionFree ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      Off
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => store.actions.setDistractionFree(true)}
                      icon={
                        store.state.distractionFree ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      On
                    </DropdownMenuItem>
                  </>
                ),
                spacerAfter: true
              },
              {
                title: "Sign out",
                item: () => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faSignOutAlt} />}
                    onClick={() => {
                      store.actions.signOutConfirmation();
                      menu.toggleMenuShowing(false);
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                )
              },
              {
                title: "Delete account",
                item: () => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => {
                      store.actions.deleteAccountConfirmation();
                      menu.toggleMenuShowing(false);
                    }}
                  >
                    Delete account
                  </DropdownMenuItem>
                )
              }
            ]}
          />
        </SettingsMenuWrap>
      )}
    >
      {menu => (
        <ExpandingIconButton
          forceShow={menu.menuShowing}
          text="Settings"
          onClick={() => menu.toggleMenuShowing(!menu.menuShowing)}
          icon={<FontAwesomeIcon icon={faCog} />}
        />
      )}
    </Menu>
  );
}
