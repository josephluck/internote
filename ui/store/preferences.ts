import { Twine } from "twine-js";
import { Api } from ".";
import {
  colorThemes,
  fontThemes,
  ColorThemeWithName,
  FontThemeWithName
} from "../theming/themes";
import { AvailableVoice } from "@internote/api/domains/preferences/entity";

interface OwnState {
  colorTheme: ColorThemeWithName | null;
  colorThemes: ColorThemeWithName[];
  fontTheme: FontThemeWithName | null;
  fontThemes: FontThemeWithName[];
  distractionFree: boolean;
  voice: AvailableVoice;
  outlineShowing: boolean;
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

interface OwnEffects {}

function defaultState(): OwnState {
  return {
    colorTheme: colorThemes[0],
    colorThemes,
    fontTheme: fontThemes[0],
    fontThemes,
    distractionFree: false,
    voice: "Joey",
    outlineShowing: false
  };
}

type Model = Twine.Model<OwnState, OwnReducers, OwnEffects>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  preferences: Twine.ModelApi<State, Actions>;
}

export function model(_api: Api): Model {
  return {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setPreferences: (state, preferences) => ({ ...state, ...preferences }),
      setColorTheme: (state, colorTheme) => ({ ...state, colorTheme }),
      setFontTheme: (state, fontTheme) => ({ ...state, fontTheme }),
      setDistractionFree: (state, distractionFree) => ({
        ...state,
        distractionFree
      }),
      setVoice: (state, voice) => ({
        ...state,
        voice
      }),
      setOutlineShowing: (state, outlineShowing) => ({
        ...state,
        outlineShowing
      })
    },
    effects: {}
  };
}
