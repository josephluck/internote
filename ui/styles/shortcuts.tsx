import React, { useEffect } from "react";
import isKeyHotkey from "is-hotkey";

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
  callback: () => any;
  /**
   * When truthy, prevents other shortcuts with the same keyCombo from
   * being called if this shortcut is higher up in the list of shortcuts.
   */
  preventOtherShortcuts?: boolean;
  /**
   * When truthy, prevents this shortcut from being triggered
   */
  disabled?: boolean;
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
}

/**
 * Default context
 */
const ShortcutsContext = React.createContext<Context>({
  shortcuts: [],
  addShortcut() {},
  removeShortcut() {}
});

/**
 * Context implementation and logic - wraps the app that needs
 * shortcuts functionality
 */
export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  /**
   * Adds a given shortcut to the list of available shortcuts.
   */
  function addShortcut(shortcut: Shortcut) {
    setCtx(prevState => {
      return {
        ...prevState,
        shortcuts: shortcutExists(prevState.shortcuts, shortcut)
          ? prevState.shortcuts
          : [shortcut, ...prevState.shortcuts]
      };
    });
  }

  /**
   * Removes a given shortcut from the list of shortcuts.
   * NB: uses the shortcut's ID property to determine whether
   * to remove it.
   */
  function removeShortcut(shortcut: Shortcut) {
    setCtx(prevState => {
      return {
        ...prevState,
        shortcuts: prevState.shortcuts.filter(s => s.id !== shortcut.id)
      };
    });
  }

  const [ctx, setCtx] = React.useState<Context>({
    shortcuts: [],
    addShortcut,
    removeShortcut
  });

  /**
   * Binds window events to the shortcut list and
   * traverses the list when a key combo is pressed.
   */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      let isPrevented = false;
      ctx.shortcuts.map(shortcut => {
        if (
          !isPrevented &&
          !shortcut.disabled &&
          typeof shortcut.keyCombo === "object"
            ? shortcut.keyCombo.some(keyCombo => isKeyHotkey(keyCombo, event))
            : isKeyHotkey(shortcut.keyCombo, event)
        ) {
          event.preventDefault();
          event.stopPropagation();
          if (shortcut.preventOtherShortcuts) {
            isPrevented = true;
          }
          shortcut.callback();
        }
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return function() {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [shortcutsHash(ctx.shortcuts)]);

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
    return function() {
      removeShortcut(shortcut);
    };
  }, [shortcut.id, shortcut.keyCombo, shortcut.disabled]);

  return null;
}

/**
 * Computes a unique hash of the list of shortcuts for effective
 * diffing two lists of shortcuts for strict equality
 */
function shortcutsHash(shortcuts: Shortcut[]): string {
  return shortcuts.reduce((prev, shortcut) => `${prev}-${shortcut.id}`, "");
}

/**
 * Returns a boolean whether a given shortcut is in the list of given
 * shortcuts.
 *
 * NB: uses the shortcut's ID property to determine inclusion.
 */
function shortcutExists(shortcuts: Shortcut[], shortcut: Shortcut): boolean {
  return shortcuts.map(s => s.id).includes(shortcut.id);
}
