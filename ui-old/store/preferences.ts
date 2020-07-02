import { Preferences } from "@internote/preferences-service/models";
import { AvailableVoice } from "@internote/speech-service/types";
import { Twine } from "twine-js";

import { Api } from "../api/api";
import {
  ColorThemeWithName,
  FontThemeWithName,
  colorThemes,
  fontThemes,
} from "../theming/themes";
import { InternoteEffect0, makeSetter } from ".";

interface OwnState
  extends Omit<Preferences, "id" | "colorTheme" | "fontTheme" | "voice"> {
  colorTheme: ColorThemeWithName | null;
  colorThemes: ColorThemeWithName[];
  fontTheme: FontThemeWithName | null;
  fontThemes: FontThemeWithName[];
  voice: AvailableVoice;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setPreferences: Twine.Reducer<OwnState, Partial<OwnState>>;
  setColorTheme: Twine.Reducer<OwnState, ColorThemeWithName>;
  setFontTheme: Twine.Reducer<OwnState, FontThemeWithName>;
  setDistractionFree: Twine.Reducer<OwnState, boolean>;
  setVoice: Twine.Reducer<OwnState, AvailableVoice>;
  setOutlineShowing: Twine.Reducer<OwnState, boolean>;
}

interface OwnEffects {
  get: InternoteEffect0<Promise<void>>;
}

function defaultState(): OwnState {
  return {
    colorTheme: colorThemes[0],
    colorThemes,
    fontTheme: fontThemes[0],
    fontThemes,
    distractionFree: false,
    voice: "Male",
    outlineShowing: false,
  };
}

type Model = Twine.Model<OwnState, OwnReducers, OwnEffects>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  preferences: Twine.ModelApi<State, Actions>;
}

const setter = makeSetter<OwnState>();

export function model(api: Api): Model {
  return {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setPreferences: (state, preferences) => ({ ...state, ...preferences }),
      setColorTheme: setter("colorTheme"),
      setFontTheme: setter("fontTheme"),
      setDistractionFree: setter("distractionFree"),
      setVoice: setter("voice"),
      setOutlineShowing: setter("outlineShowing"),
    },
    effects: {
      async get(state, actions) {
        const result = await api.preferences.get(state.auth.session);
        result.map((preferences) => {
          actions.preferences.setPreferences(
            deserializePreferences(preferences)
          );
        });
      },
    },
  };
}

function deserializePreferences(preferences: Preferences): OwnState {
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