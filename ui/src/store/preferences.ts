import { Preferences } from "@internote/preferences-service/models";
import { AvailableVoice } from "@internote/speech-service/types";

import { api } from "../api";
import {
  ColorThemeWithName,
  FontThemeWithName,
  colorThemes,
  fontThemes,
} from "../theming/themes";
import { store } from "./store";

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

export const resetState = store.createMutator(
  (state) => (state.preferences = preferencesInitialState)
);

export const setPreferences = store.createMutator(
  (state, preferences: Partial<PreferencesState>) => {
    state.preferences = { ...state.preferences, ...preferences };
  }
);

const getValueFromPreferences = <K extends keyof PreferencesState>(
  key: K,
  preferences: PreferencesState
): PreferencesState[K] | null => {
  switch (key) {
    case "colorTheme":
      // @ts-ignore
      return preferences[key].name;
    case "fontTheme":
      // @ts-ignore
      return preferences[key].name;
    case "distractionFree":
    case "voice":
    case "outlineShowing":
      // @ts-ignore
      return preferences[key];
    default:
      return null;
  }
};

const setter = <K extends keyof PreferencesState>(key: K) =>
  store.createMutator((state, value: PreferencesState[K]) => {
    state.preferences[key] = value;
    const saveValue = getValueFromPreferences(key, state.preferences);
    if (saveValue) {
      api.preferences.update(state.auth.session, { [key]: saveValue });
    }
  });

export const setColorTheme = setter("colorTheme");
export const setFontTheme = setter("fontTheme");
export const setDistractionFree = setter("distractionFree");
export const setVoice = setter("voice");
export const setOutlineShowing = setter("outlineShowing");

export const getPreferences = store.createEffect(async (state) => {
  const result = await api.preferences.get(state.auth.session);
  result.map((preferences) => {
    setPreferences(deserializePreferences(preferences));
  });
});

function deserializePreferences(preferences: Preferences): PreferencesState {
  return {
    ...preferences,
    colorThemes,
    colorTheme:
      colorThemes.find((theme) => theme.name === preferences.colorTheme) ||
      colorThemes[0],
    fontThemes,
    fontTheme:
      fontThemes.find((theme) => theme.name === preferences.fontTheme) ||
      fontThemes[0],
    voice: preferences.voice as AvailableVoice,
  };
}
