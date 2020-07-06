import isHotkey from "is-hotkey";
import React, { useCallback, useEffect, useState } from "react";

import { anyOverlappingStrOccurrences } from "../utilities/string";

interface Shortcut {
  /**
   * A globally unique ID for a shortcut.
   * Should not clash with any other defined shortcut in the app.
   */
  id: string;
  /**
   * A description of what the shortcut does
   */
  description: string;
  /**
   * The keyboard combination used to trigger the callback function.
   *
   * An array of string is supported where each string in the array
   * will become a keyCombo that will trigger the callback.
   */
  keyCombo: string | string[];
  /**
   * The callback to trigger when the keyCombo is pressed by the user.
   */
  callback: (event: React.KeyboardEvent) => any;
  /**
   * When truthy, prevents other shortcuts with the same keyCombo from
   * being called if this shortcut is higher up in the list of shortcuts.
   */
  preventOtherShortcuts?: boolean;
  /**
   * When truthy, prevents this shortcut from being triggered
   */
  disabled?: boolean;
  /**
   * Determines the priority of a given shortcut against other shortcuts.
   * This number determines the order in which shortcuts are traversed when
   * a keyboard shortcut is fired. It also determines the order in which
   * shortcuts appear in the list of available shortcuts.
   * NB: defaults to 1.
   */
  priority?: number;
}

interface Context {
  /**
   * The list of currently defined shortcuts.
   */
  shortcuts: Shortcut[];
  /**
   * Adds a given shortcut to the list of available shortcuts.
   */
  addShortcut: (shortcut: Shortcut) => void;
  /**
   * Removes a given shortcut from the list of shortcuts.
   * NB: uses the shortcut's ID property to determine whether
   * to remove it.
   */
  removeShortcut: (shortcut: Shortcut) => void;
  /**
   * Given a keyboard event, runs through the list of shortcuts and handles them
   */
  handleShortcuts: (event: React.KeyboardEvent) => void;
}

/**
 * Default context
 */
export const ShortcutsContext = React.createContext<Context>({
  handleShortcuts: () => void null,
  shortcuts: [],
  addShortcut() {},
  removeShortcut() {},
});

/**
 * Context implementation and logic - wraps the app that needs
 * shortcuts functionality
 */
export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  /**
   * Adds a given shortcut to the list of available shortcuts.
   */
  const addShortcut = useCallback(
    (shortcut: Shortcut) =>
      setShortcuts((prevShortcuts) =>
        shortcutExists(prevShortcuts, shortcut)
          ? prevShortcuts
          : [shortcut, ...prevShortcuts].sort(sortShortcuts)
      ),
    [setShortcuts]
  );

  /**
   * Removes a given shortcut from the list of shortcuts.
   * NB: uses the shortcut's ID property to determine whether
   * to remove it.
   */
  const removeShortcut = useCallback(
    (shortcut: Shortcut) =>
      setShortcuts((prevShortcuts) =>
        prevShortcuts.filter((s) => s.id !== shortcut.id)
      ),
    [setShortcuts]
  );

  const handleShortcuts = useCallback(
    (event: React.KeyboardEvent) => {
      const enabledShortcuts = shortcuts.filter(
        ({ disabled = false }) => disabled === false
      );
      enabledShortcuts.reduce((isPrevented, shortcut) => {
        if (!isPrevented && isHotkey(shortcut.keyCombo, event as any)) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.callback(event as any);
          return Boolean(shortcut.preventOtherShortcuts);
        }
        return isPrevented;
      }, false);
    },
    [shortcuts]
  );

  const ctx: Context = {
    handleShortcuts,
    shortcuts,
    addShortcut,
    removeShortcut,
  };

  return (
    <ShortcutsContext.Provider value={ctx}>
      {children}
    </ShortcutsContext.Provider>
  );
}

/**
 * Adds a shortcut to the list of available shortcuts in the app
 * when mounted.
 *
 * When unmounted, removes the shortcut from the list of available
 * shortcuts.
 */
export function Shortcut(shortcut: Shortcut) {
  const { addShortcut, removeShortcut } = React.useContext(ShortcutsContext);

  useEffect(() => {
    addShortcut(shortcut);
    return () => removeShortcut(shortcut);
  }, [
    addShortcut,
    removeShortcut,
    shortcut.id,
    shortcut.keyCombo,
    shortcut.disabled,
    shortcut.callback,
  ]);

  return null;
}

/**
 * Computes a unique hash of the list of shortcuts for effective
 * diffing two lists of shortcuts for strict equality
 */
// function shortcutsHash(shortcuts: Shortcut[]): string {
//   return shortcuts.reduce((prev, shortcut) => `${prev}-${shortcut.id}`, "");
// }

/**
 * Returns a boolean whether a given shortcut is in the list of given
 * shortcuts.
 *
 * NB: uses the shortcut's ID property to determine inclusion.
 */
function shortcutExists(shortcuts: Shortcut[], shortcut: Shortcut): boolean {
  return shortcuts.map((s) => s.id).includes(shortcut.id);
}

/**
 * Sorts two shortcuts according to their priority then
 * alphabetically on description
 */
function sortShortcuts(
  { priority: priorityA = 1, description: descriptionA }: Shortcut,
  { priority: priorityB = 1, description: descriptionB }: Shortcut
): number {
  if (priorityB === priorityA) {
    // Sort alphabetically on description at equal priority
    return descriptionA < descriptionB ? -1 : 1;
  }
  // Sort on priority if different
  return priorityB - priorityA;
}

/**
 * Given a shortcut within a list of shortcuts, determines
 * whether the shortcut will be prevented by higher priority
 * shortcuts that are set to prevent other shortcuts
 */
export function shortcutWillBePrevented(
  shortcut: Shortcut,
  shortcuts: Shortcut[]
): boolean {
  const index = shortcuts.findIndex((s) => s.id === shortcut.id);
  return shortcuts.some(
    (s, i) =>
      s.preventOtherShortcuts &&
      i < index &&
      anyOverlappingStrOccurrences(shortcut.keyCombo, s.keyCombo)
  );
}
