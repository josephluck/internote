import React from "react";
import { Store } from "../store";
import { MenuControl } from "./menu-control";
import {
  faCog,
  faSignOutAlt,
  faTrash,
  faPalette,
  faCheck,
  faFont,
  faEye,
  faMicrophone,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, DropdownMenuItem } from "./dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { size } from "../theming/symbols";
import { ListMenuControl } from "./list-menu-control";
import { ExpandingIconButton } from "./expanding-icon-button";
import { availableVoices } from "@internote/api/domains/preferences/api";
import { Shortcut } from "./shortcuts";

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
  const [subMenuOpen, setSubMenuOpen] = React.useState<boolean>(false);
  return (
    <Menu
      onMenuToggled={onMenuToggled}
      menuName="Settings menu"
      disableCloseShortcut={subMenuOpen}
      menu={menu => (
        <SettingsMenuWrap showing={menu.menuShowing} position="right">
          {!menu.menuShowing ? (
            <Shortcut
              id="open-settings-menu"
              description="Open settings menu"
              keyCombo="mod+s"
              callback={() => menu.toggleMenuShowing(true)}
            />
          ) : null}
          <ListMenuControl
            onSubMenuToggled={setSubMenuOpen}
            shortcutsEnabled={menu.menuShowing}
            items={[
              {
                title: "Colours",
                shortcut: "c",
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
                    {store.state.preferences.colorThemes.map(theme => (
                      <DropdownMenuItem
                        onClick={() =>
                          store.actions.preferences.setColorTheme(theme)
                        }
                        icon={
                          theme.name ===
                          store.state.preferences.colorTheme.name ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : null
                        }
                      >
                        {theme.name}
                        {theme.shortcut ? (
                          <Shortcut
                            id={`set-color-theme-${theme.name}`}
                            description={`Set color theme to ${theme.name}`}
                            keyCombo={theme.shortcut}
                            disabled={
                              theme.name ===
                              store.state.preferences.colorTheme.name
                            }
                            callback={() =>
                              store.actions.preferences.setColorTheme(theme)
                            }
                          />
                        ) : null}
                      </DropdownMenuItem>
                    ))}
                  </>
                )
              },
              {
                title: "Typography",
                shortcut: "t",
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
                    {store.state.preferences.fontThemes.map(theme => (
                      <DropdownMenuItem
                        onClick={() =>
                          store.actions.preferences.setFontTheme(theme)
                        }
                        icon={
                          theme.name ===
                          store.state.preferences.fontTheme.name ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : null
                        }
                      >
                        <span style={{ fontFamily: theme.theme.fontFamily }}>
                          {theme.name}
                        </span>
                        {theme.shortcut ? (
                          <Shortcut
                            id={`set-typography-theme-${theme.name}`}
                            description={`Set typography to ${theme.name}`}
                            keyCombo={theme.shortcut}
                            disabled={
                              theme.name ===
                              store.state.preferences.fontTheme.name
                            }
                            callback={() =>
                              store.actions.preferences.setFontTheme(theme)
                            }
                          />
                        ) : null}
                      </DropdownMenuItem>
                    ))}
                  </>
                )
              },
              {
                title: "Focus mode",
                shortcut: "f",
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
                      onClick={() =>
                        store.actions.preferences.setDistractionFree(false)
                      }
                      icon={
                        !store.state.preferences.distractionFree ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      Off
                      <Shortcut
                        id="distraction-free-off"
                        description="Turn off distraction-free mode"
                        keyCombo="n"
                        preventOtherShortcuts={true}
                        disabled={!store.state.preferences.distractionFree}
                        callback={() =>
                          store.actions.preferences.setDistractionFree(false)
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        store.actions.preferences.setDistractionFree(true)
                      }
                      icon={
                        store.state.preferences.distractionFree ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      On
                      <Shortcut
                        id="distraction-free-on"
                        description="Turn on distraction-free mode"
                        keyCombo="y"
                        preventOtherShortcuts={true}
                        disabled={store.state.preferences.distractionFree}
                        callback={() =>
                          store.actions.preferences.setDistractionFree(true)
                        }
                      />
                    </DropdownMenuItem>
                  </>
                )
              },
              {
                title: "Outline view",
                shortcut: "o",
                item: list => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faSearch} />}
                    onClick={() => {
                      list.toSubMenu("Outline view");
                    }}
                  >
                    Outline view
                  </DropdownMenuItem>
                ),
                subMenu: () => (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        store.actions.preferences.setOutlineShowing(false)
                      }
                      icon={
                        !store.state.preferences.outlineShowing ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      Off
                      <Shortcut
                        id="outline-free-off"
                        description="Turn off outline mode"
                        keyCombo="n"
                        preventOtherShortcuts={true}
                        disabled={!store.state.preferences.outlineShowing}
                        callback={() =>
                          store.actions.preferences.setOutlineShowing(false)
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        store.actions.preferences.setOutlineShowing(true)
                      }
                      icon={
                        store.state.preferences.outlineShowing ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      On
                      <Shortcut
                        id="outline-free-on"
                        description="Turn on outline mode"
                        keyCombo="y"
                        preventOtherShortcuts={true}
                        disabled={store.state.preferences.outlineShowing}
                        callback={() =>
                          store.actions.preferences.setOutlineShowing(true)
                        }
                      />
                    </DropdownMenuItem>
                  </>
                )
              },
              {
                title: "Voice",
                shortcut: "v",
                item: list => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faMicrophone} />}
                    onClick={() => {
                      list.toSubMenu("Voice");
                    }}
                  >
                    Voice
                  </DropdownMenuItem>
                ),
                subMenu: () => (
                  <>
                    {availableVoices.map(voice => (
                      <DropdownMenuItem
                        key={voice}
                        onClick={() =>
                          store.actions.preferences.setVoice(voice)
                        }
                        icon={
                          store.state.preferences.voice === voice ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : null
                        }
                      >
                        {voice}
                        {/* TODO: add keyboard shortcuts to voices */}
                      </DropdownMenuItem>
                    ))}
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
                      store.actions.auth.signOutConfirmation();
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
                      store.actions.auth.deleteAccountConfirmation();
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
