import { Store } from "../store";
import { MenuControl } from "./menu-control";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownChevron
} from "./dropdown-menu";
import Link from "next/link";

export function NoteMenu({ store }: { store: Store }) {
  return (
    <MenuControl
      menu={menu => (
        <DropdownMenu showing={menu.menuShowing}>
          <DropdownMenuItem
            icon={faPlus}
            onClick={() => {
              store.actions.newNote();
              menu.toggleMenuShowing(false);
            }}
          >
            New note
          </DropdownMenuItem>
          {store.state.notes.map(note => (
            <Link href={`?id=${note.id}`} passHref key={note.id}>
              <a>
                <DropdownMenuItem
                  icon={
                    store.state.note && store.state.note.id === note.id
                      ? faCheck
                      : null
                  }
                  onClick={() => menu.toggleMenuShowing(false)}
                >
                  {note.title}
                </DropdownMenuItem>
              </a>
            </Link>
          ))}
        </DropdownMenu>
      )}
    >
      {menu => (
        <DropdownChevron onClick={() => menu.toggleMenuShowing(true)}>
          {store.state.note ? store.state.note.title : null}
        </DropdownChevron>
      )}
    </MenuControl>
  );
}
