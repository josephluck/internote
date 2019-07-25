export class Preferences {
  /**
   * Cognito user id
   */
  id: string;
  colorTheme?: string;
  fontTheme?: string;
  distractionFree?: boolean;
  voice?: string;
  outlineShowing?: boolean;
}

export const defaultPreferences: Preferences = {
  id: "",
  colorTheme: "Internote",
  fontTheme: "Inter",
  distractionFree: false,
  voice: "Joey",
  outlineShowing: true
};
