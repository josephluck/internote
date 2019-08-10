import { Twine } from "twine-js";
import { InternoteEffect0 } from ".";
import {
  colorThemes,
  fontThemes,
  ColorThemeWithName,
  FontThemeWithName
} from "../theming/themes";
import { Api } from "../api/api";
import { AvailableVoice } from "@internote/speech-service/types";

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

interface OwnEffects {
  get: InternoteEffect0;
}

function defaultState(): OwnState {
  return {
    colorTheme: colorThemes[0],
    colorThemes,
    fontTheme: fontThemes[0],
    fontThemes,
    distractionFree: false,
    voice: "Male",
    outlineShowing: false
  };
}

type Model = Twine.Model<OwnState, OwnReducers, OwnEffects>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  preferences: Twine.ModelApi<State, Actions>;
}

export function model(api: Api): Model {
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
    effects: {
      async get(state, actions) {
        const result = await api.preferences.get(state.auth.session);
        result.map(preferences => {
          actions.preferences.setPreferences({
            ...preferences,
            colorTheme:
              colorThemes.find(
                theme => theme.name === preferences.colorTheme
              ) || colorThemes[0],
            fontTheme:
              fontThemes.find(theme => theme.name === preferences.fontTheme) ||
              fontThemes[0],
            voice: preferences.voice as AvailableVoice
          });
        });
      }
    }
  };
}
