export class Preferences {
  /**
   * Cognito identity id
   */
  id: string;
  colorTheme?: string;
  fontTheme?: string;
  distractionFree?: boolean;
  voice?: string;
  outlineShowing?: boolean;
  /**
   * Experimental offline sync
   */
  offlineSync?: boolean;
}

export const defaultPreferences: Preferences = {
  id: "",
  colorTheme: "Dark",
  fontTheme: "Sans serif",
  distractionFree: false,
  voice: "Male",
  outlineShowing: true,
  offlineSync: false
};
