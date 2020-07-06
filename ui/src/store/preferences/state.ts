import { Preferences } from "@internote/preferences-service/models";
import { AvailableVoice } from "@internote/speech-service/types";

import {
  ColorThemeWithName,
  FontThemeWithName,
  colorThemes,
  fontThemes,
} from "../../theming/themes";

export type PreferencesState = Omit<
  Preferences,
  "id" | "colorTheme" | "fontTheme" | "voice"
> & {
  colorTheme: ColorThemeWithName;
  colorThemes: ColorThemeWithName[];
  fontTheme: FontThemeWithName;
  fontThemes: FontThemeWithName[];
  voice: AvailableVoice;
};

export const preferencesInitialState: PreferencesState = {
  colorTheme: colorThemes[0],
  colorThemes,
  fontTheme: fontThemes[0],
  fontThemes,
  distractionFree: false,
  voice: "Male",
  outlineShowing: false,
};
