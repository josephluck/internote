import { faHtml5, faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { faDownload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

import { html, markdown } from "../store/export-note";
import { useLoadingAction } from "../store/store";
import { size } from "../theming/symbols";
import { DropdownMenu, DropdownMenuItem } from "./dropdown-menu";
import { ExpandingIconButton } from "./expanding-icon-button";
import { ListMenuControl } from "./list-menu-control";
import { MenuControl } from "./menu-control";
import { Shortcut } from "./shortcuts";

const ExportMenuWrap = styled(DropdownMenu)`
  width: ${size.settingsMenuDropdownWidth};
`;

const Menu = styled(MenuControl)`
  display: flex;
`;

export function ExportMenu({
  onMenuToggled,
  noteId,
}: {
  onMenuToggled: (menuShowing: boolean) => void;
  noteId: string;
}) {
  const exportMarkdown = useLoadingAction(markdown);
  const exportHtml = useLoadingAction(html);

  const [subMenuOpen, setSubMenuOpen] = React.useState<boolean>(false);

  return (
    <Menu
      onMenuToggled={onMenuToggled}
      menuName="Export menu"
      disableCloseShortcut={subMenuOpen}
      menu={(menu) => (
        <ExportMenuWrap showing={menu.menuShowing} horizontalPosition="right">
          {!menu.menuShowing ? (
            <Shortcut
              id="open-export-menu"
              description="Open export menu"
              keyCombo="mod+e"
              preventOtherShortcuts={true}
              callback={() => menu.toggleMenuShowing(true)}
            />
          ) : null}
          <ListMenuControl
            onSubMenuToggled={setSubMenuOpen}
            shortcutsEnabled={menu.menuShowing}
            items={[
              {
                title: "Export markdown",
                shortcut: "m",
                item: () => (
                  <DropdownMenuItem
                    icon={
                      <FontAwesomeIcon
                        icon={exportMarkdown.loading ? faSpinner : faMarkdown}
                        spin={exportMarkdown.loading}
                      />
                    }
                    onClick={async () => {
                      await exportMarkdown.exec(noteId);
                      menu.toggleMenuShowing(false);
                    }}
                  >
                    Export Markdown
                  </DropdownMenuItem>
                ),
              },
              {
                title: "Export HTML",
                shortcut: "h",
                item: () => (
                  <DropdownMenuItem
                    icon={
                      <FontAwesomeIcon
                        icon={exportHtml.loading ? faSpinner : faHtml5}
                        spin={exportHtml.loading}
                      />
                    }
                    onClick={async () => {
                      await exportHtml.exec(noteId);
                      menu.toggleMenuShowing(false);
                    }}
                  >
                    Export HTML
                  </DropdownMenuItem>
                ),
              },
            ]}
          />
        </ExportMenuWrap>
      )}
    >
      {(menu) => (
        <ExpandingIconButton
          forceShow={menu.menuShowing || false}
          text="Export note"
          onClick={() => menu.toggleMenuShowing(!menu.menuShowing)}
          icon={<FontAwesomeIcon icon={faDownload} />}
        />
      )}
    </Menu>
  );
}
