import {
  faCheck,
  faCog,
  faEye,
  faFont,
  faMicrophone,
  faPalette,
  faSearch,
  faSignOutAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { availableVoices } from "@internote/speech-service/available-voices";
import React from "react";
import styled from "styled-components";

import { useTwineActions, useTwineState } from "../store";
import { size } from "../theming/symbols";
import { shortcutPriorities } from "../utilities/shortcuts";
import { DropdownMenu, DropdownMenuItem } from "./dropdown-menu";
import { ExpandingIconButton } from "./expanding-icon-button";
import { ListMenuControl } from "./list-menu-control";
import { MenuControl } from "./menu-control";
import { Shortcut } from "./shortcuts";

const SettingsMenuWrap = styled(DropdownMenu)`
  width: ${size.settingsMenuDropdownWidth};
`;

const Menu = styled(MenuControl)`
  display: flex;
`;

export function SettingsMenu({
  onMenuToggled,
}: {
  onMenuToggled: (menuShowing?: boolean) => void;
}) {
  const colorThemes = useTwineState((state) => state.preferences.colorThemes);
  const colorTheme = useTwineState((state) => state.preferences.colorTheme);
  const fontThemes = useTwineState((state) => state.preferences.fontThemes);
  const fontTheme = useTwineState((state) => state.preferences.fontTheme);
  const distractionFree = useTwineState(
    (state) => state.preferences.distractionFree
  );
  const outlineShowing = useTwineState(
    (state) => state.preferences.outlineShowing
  );

  const voice = useTwineState((state) => state.preferences.voice);
  const {
    setColorTheme,
    setFontTheme,
    setDistractionFree,
    setOutlineShowing,
    setVoice,
    signOutConfirmation,
    deleteAccountConfirmation,
  } = useTwineActions((actions) => ({
    setColorTheme: actions.preferences.setColorTheme,
    setFontTheme: actions.preferences.setFontTheme,
    setDistractionFree: actions.preferences.setDistractionFree,
    setOutlineShowing: actions.preferences.setOutlineShowing,
    setVoice: actions.preferences.setVoice,
    signOutConfirmation: actions.auth.signOutConfirmation,
    deleteAccountConfirmation: actions.auth.deleteAccountConfirmation,
  }));

  const [subMenuOpen, setSubMenuOpen] = React.useState<boolean>(false);

  return (
    <Menu
      onMenuToggled={onMenuToggled}
      menuName="Settings menu"
      disableCloseShortcut={subMenuOpen}
      menu={(menu) => (
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
                item: (list) => (
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
                    {colorThemes.map((theme) => (
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
                ),
              },
              {
                title: "Typography",
                shortcut: "t",
                item: (list) => (
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
                    {fontThemes.map((theme) => (
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
                ),
              },
              {
                title: "Focus mode",
                shortcut: "f",
                item: (list) => (
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
                ),
              },
              {
                title: "Outline view",
                shortcut: "o",
                item: (list) => (
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
                ),
              },
              {
                title: "Voice",
                shortcut: "v",
                item: (list) => (
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
                    {availableVoices.map((v) => (
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
                      </DropdownMenuItem>
                    ))}
                  </>
                ),
                spacerAfter: true,
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
                ),
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
                ),
              },
            ]}
          />
        </SettingsMenuWrap>
      )}
    >
      {(menu) => (
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
