import { Store } from "../store";
import { MenuControl } from "./menu-control";
import {
  faCog,
  faSignOutAlt,
  faTrash,
  faPalette,
  faCheck,
  faFont
} from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, DropdownMenuItem } from "./dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "../theming/styled";
import { OnKeyboardShortcut } from "./on-keyboard-shortcut";
import { CollapseWidthOnHover } from "./collapse-width-on-hover";
import { spacing, font, borderRadius, size } from "../theming/symbols";
import { ListMenuControl } from "./list-menu-control";

const SettingsMenuWrap = styled(DropdownMenu)`
  width: ${size.settingsMenuDropdownWidth};
`;

const Menu = styled(MenuControl)`
  display: flex;
`;

const SettingsIcon = styled.div`
  transition: all 260ms ease;
`;

const SettingsButton = styled.div<{ forceShow: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius._6};
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
  overflow: hidden;
  padding: ${spacing._0_25};
  transition: all 300ms ease;
  color: ${props =>
    props.forceShow
      ? props.theme.settingsButtonActiveText
      : props.theme.settingsButtonInactiveText};
  background: ${props => props.theme.settingsButtonBackground};
  cursor: pointer;
  ${SettingsIcon} {
    transform: rotate(${props => (props.forceShow ? "-220deg" : "0deg")});
  }
  &:hover {
    color: ${props => props.theme.settingsButtonActiveText};
    ${SettingsIcon} {
      transform: rotate(-220deg);
    }
  }
`;

const SettingsText = styled.div`
  padding-left: ${spacing._0_25};
  font-weight: 600;
`;

export function SettingsMenu({ store }: { store: Store }) {
  return (
    <Menu
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
                title: "Fonts",
                item: list => (
                  <DropdownMenuItem
                    icon={<FontAwesomeIcon icon={faFont} />}
                    onClick={() => {
                      list.toSubMenu("Fonts");
                    }}
                  >
                    Fonts
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
                        {theme.name}
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
        <CollapseWidthOnHover
          forceShow={menu.menuShowing}
          collapsedContent={<SettingsText>Settings</SettingsText>}
        >
          {collapse => (
            <SettingsButton
              forceShow={menu.menuShowing}
              onClick={() => menu.toggleMenuShowing(!menu.menuShowing)}
            >
              <SettingsIcon>
                <FontAwesomeIcon icon={faCog} />
              </SettingsIcon>
              {collapse.renderCollapsedContent()}
            </SettingsButton>
          )}
        </CollapseWidthOnHover>
      )}
    </Menu>
  );
}
