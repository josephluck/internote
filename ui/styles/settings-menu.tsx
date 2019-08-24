import React from "react";
import { useTwineState, useTwineActions } from "../store";
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
  faSearch,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSpacer
} from "./dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { size, font, spacing } from "../theming/symbols";
import { ListMenuControl } from "./list-menu-control";
import { ExpandingIconButton } from "./expanding-icon-button";
import { Shortcut } from "./shortcuts";
import { shortcutPriorities } from "../utilities/shortcuts";
import { availableVoices } from "@internote/speech-service/available-voices";

const SettingsMenuWrap = styled(DropdownMenu)`
  width: ${size.settingsMenuDropdownWidth};
`;

const Menu = styled(MenuControl)`
  display: flex;
`;

const Description = styled.p`
  font-size: ${font._12.size};
  line-height: ${font._16.lineHeight};
  color: ${props => props.theme.settingsMenuDescriptionText};
  padding: 0 ${spacing._1} ${spacing._0_25};
`;

export function SettingsMenu({
  onMenuToggled
}: {
  onMenuToggled: (menuShowing: boolean) => void;
}) {
  const colorThemes = useTwineState(state => state.preferences.colorThemes);
  const colorTheme = useTwineState(state => state.preferences.colorTheme);
  const fontThemes = useTwineState(state => state.preferences.fontThemes);
  const fontTheme = useTwineState(state => state.preferences.fontTheme);
  const distractionFree = useTwineState(
    state => state.preferences.distractionFree
  );
  const outlineShowing = useTwineState(
    state => state.preferences.outlineShowing
  );
  const offlineSync = useTwineState(state => state.preferences.offlineSync);
  const offlineSyncPreferenceSaving = useTwineState(
    state => state.sync.loading.setOfflineSync
  );
  const voice = useTwineState(state => state.preferences.voice);
  const {
    setColorTheme,
    setFontTheme,
    setDistractionFree,
    setOutlineShowing,
    setOfflineSync,
    setVoice,
    signOutConfirmation,
    deleteAccountConfirmation
  } = useTwineActions(actions => ({
    setColorTheme: actions.preferences.setColorTheme,
    setFontTheme: actions.preferences.setFontTheme,
    setDistractionFree: actions.preferences.setDistractionFree,
    setOutlineShowing: actions.preferences.setOutlineShowing,
    setOfflineSync: actions.sync.setOfflineSync,
    setVoice: actions.preferences.setVoice,
    signOutConfirmation: actions.auth.signOutConfirmation,
    deleteAccountConfirmation: actions.auth.deleteAccountConfirmation
  }));

  const [subMenuOpen, setSubMenuOpen] = React.useState<boolean>(false);

  return (
    <Menu
      onMenuToggled={onMenuToggled}
      menuName="Settings menu"
      disableCloseShortcut={subMenuOpen}
      menu={menu => (
        <SettingsMenuWrap showing={menu.menuShowing} horizontalPosition="right">
          {!menu.menuShowing ? (
            <Shortcut
              id="open-settings-menu"
              description="Open settings menu"
              keyCombo="mod+shift+s"
              preventOtherShortcuts={true}
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
                    {colorThemes.map(theme => (
                      <DropdownMenuItem
                        onClick={() => setColorTheme(theme)}
                        icon={
                          theme.name === colorTheme.name ? (
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
                            disabled={theme.name === colorTheme.name}
                            callback={() => setColorTheme(theme)}
                            priority={shortcutPriorities.settingsOption}
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
                    {fontThemes.map(theme => (
                      <DropdownMenuItem
                        onClick={() => setFontTheme(theme)}
                        icon={
                          theme.name === fontTheme.name ? (
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
                            disabled={theme.name === fontTheme.name}
                            callback={() => setFontTheme(theme)}
                            priority={shortcutPriorities.settingsOption}
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
                      onClick={() => setDistractionFree(false)}
                      icon={
                        !distractionFree ? (
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
                        disabled={!distractionFree}
                        callback={() => setDistractionFree(false)}
                        priority={shortcutPriorities.settingsOption}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDistractionFree(true)}
                      icon={
                        distractionFree ? (
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
                        disabled={distractionFree}
                        callback={() => setDistractionFree(true)}
                        priority={shortcutPriorities.settingsOption}
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
                      onClick={() => setOutlineShowing(false)}
                      icon={
                        !outlineShowing ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      Off
                      <Shortcut
                        id="outline-mode-off"
                        description="Turn off outline mode"
                        keyCombo="n"
                        preventOtherShortcuts={true}
                        disabled={!outlineShowing}
                        callback={() => setOutlineShowing(false)}
                        priority={shortcutPriorities.settingsOption}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setOutlineShowing(true)}
                      icon={
                        outlineShowing ? (
                          <FontAwesomeIcon icon={faCheck} />
                        ) : null
                      }
                    >
                      On
                      <Shortcut
                        id="outline-mode-on"
                        description="Turn on outline mode"
                        keyCombo="y"
                        preventOtherShortcuts={true}
                        disabled={outlineShowing}
                        callback={() => setOutlineShowing(true)}
                        priority={shortcutPriorities.settingsOption}
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
                    {availableVoices.map(v => (
                      <DropdownMenuItem
                        key={v}
                        onClick={() => setVoice(v)}
                        icon={
                          v === voice ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : null
                        }
                      >
                        {v}
                        {/* TODO: add keyboard shortcuts to voices */}
                      </DropdownMenuItem>
                    ))}
                  </>
                ),
                spacerAfter: false
              },
              {
                title: "Offline sync",
                shortcut: "s",
                item: list => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faSync} />}
                    onClick={() => {
                      list.toSubMenu("Offline sync");
                    }}
                  >
                    Offline sync
                  </DropdownMenuItem>
                ),
                subMenu: () => (
                  <div>
                    <Description>
                      Offline sync isn't ready for prime time yet. You might
                      loose your notes, overwrite things by mistake and
                      Internote might completely stop working if you turn it
                      on...
                    </Description>
                    <DropdownMenuSpacer />
                    <DropdownMenuItem
                      onClick={() => setOfflineSync(false)}
                      icon={
                        !offlineSync ? (
                          <FontAwesomeIcon
                            icon={
                              offlineSyncPreferenceSaving ? faSync : faCheck
                            }
                            spin={offlineSyncPreferenceSaving}
                          />
                        ) : null
                      }
                    >
                      Off
                      <Shortcut
                        id="offline-sync-off"
                        description="Turn off offline sync"
                        keyCombo="n"
                        preventOtherShortcuts={true}
                        disabled={!offlineSync}
                        callback={() => setOfflineSync(false)}
                        priority={shortcutPriorities.settingsOption}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setOfflineSync(true)}
                      icon={
                        offlineSync ? (
                          <FontAwesomeIcon
                            icon={
                              offlineSyncPreferenceSaving ? faSync : faCheck
                            }
                            spin={offlineSyncPreferenceSaving}
                          />
                        ) : null
                      }
                    >
                      Yes, I understand the risks
                      <Shortcut
                        id="offline-sync-on"
                        description="Turn on offline sync"
                        keyCombo="y"
                        preventOtherShortcuts={true}
                        disabled={offlineSync}
                        callback={() => setOfflineSync(true)}
                        priority={shortcutPriorities.settingsOption}
                      />
                    </DropdownMenuItem>
                  </div>
                ),
                spacerAfter: true
              },
              {
                title: "Sign out",
                item: () => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faSignOutAlt} />}
                    onClick={() => {
                      signOutConfirmation();
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
                      deleteAccountConfirmation();
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
