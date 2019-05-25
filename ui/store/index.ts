import twine, { Twine } from "twine-js";
import logger from "twine-js/lib/log";
import * as Types from "@internote/api/domains/types";
import makeApi from "@internote/api/domains/api";
import Router from "next/router";
import { makeSubscriber } from "./make-subscriber";
import { AxiosError } from "axios";
import cookie from "../utilities/cookie";
import { isServer } from "../utilities/window";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Theme, FontTheme, colorThemes, fontThemes } from "../theming/themes";
import { requestFullScreen, exitFullscreen } from "../utilities/fullscreen";
import { AvailableVoice } from "@internote/api/domains/preferences/entity";

const cookies = cookie();

interface Confirmation {
  copy?: string;
  yesText?: string;
  noText?: string;
  onConfirm: () => any;
  loading?: boolean;
}

interface ColorThemeWithName {
  name: string;
  theme: Theme;
}

interface FontThemeWithName {
  name: string;
  theme: FontTheme;
}

interface OwnState {
  session: Types.Session | null;
  notes: Types.Note[];
  confirmation: Confirmation | null;
  colorTheme: ColorThemeWithName | null;
  colorThemes: ColorThemeWithName[];
  fontTheme: FontThemeWithName | null;
  fontThemes: FontThemeWithName[];
  distractionFree: boolean;
  voice: AvailableVoice;
  isFullscreen: boolean;
  outlineShowing: boolean;
  dictionaryShowing: boolean;
  speechSrc: string | null;
  dictionaryResults: Types.DictionaryResult[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSession: Twine.Reducer<OwnState, Types.Session>;
  setNotes: Twine.Reducer<OwnState, Types.Note[]>;
  setConfirmation: Twine.Reducer<OwnState, Confirmation | null>;
  setConfirmationLoading: Twine.Reducer<OwnState, boolean>;
  setColorTheme: Twine.Reducer<OwnState, ColorThemeWithName>;
  setFontTheme: Twine.Reducer<OwnState, FontThemeWithName>;
  setDistractionFree: Twine.Reducer<OwnState, boolean>;
  setDictionaryShowing: Twine.Reducer<OwnState, boolean>;
  setVoice: Twine.Reducer<OwnState, AvailableVoice>;
  setFullscreen: Twine.Reducer<OwnState, boolean>;
  setOutlineShowing: Twine.Reducer<OwnState, boolean>;
  setSpeechSrc: Twine.Reducer<OwnState, string | null>;
  setDictionaryResults: Twine.Reducer<OwnState, Types.DictionaryResult[]>;
}

interface OwnEffects {
  fetchNotes: Twine.Effect0<OwnState, Actions, Promise<Types.Note[]>>;
  createNote: Twine.Effect0<OwnState, Actions>;
  updateNote: Twine.Effect<
    OwnState,
    Actions,
    { noteId: string; content: {}; title: string | undefined },
    Promise<void>
  >;
  deleteNoteConfirmation: Twine.Effect<OwnState, Actions, { noteId: string }>;
  deleteNote: Twine.Effect<OwnState, Actions, { noteId: string }>;
  navigateToFirstNote: Twine.Effect0<OwnState, Actions, Promise<void>>;
  signUp: Twine.Effect<OwnState, Actions, Types.SignupRequest, Promise<void>>;
  session: Twine.Effect<OwnState, Actions, { token: string }, Promise<void>>;
  authenticate: Twine.Effect<
    OwnState,
    Actions,
    Types.LoginRequest,
    Promise<void>
  >;
  signOutConfirmation: Twine.Effect0<OwnState, Actions>;
  signOut: Twine.Effect0<OwnState, Actions>;
  deleteAccountConfirmation: Twine.Effect0<OwnState, Actions>;
  deleteAccount: Twine.Effect0<OwnState, Actions, Promise<void>>;
  handleApiError: Twine.Effect<OwnState, Actions, AxiosError>;
  toggleFullscreen: Twine.Effect<OwnState, Actions, boolean>;
  requestSpeech: Twine.Effect<
    OwnState,
    Actions,
    { content: string; noteId: string }
  >;
  requestDictionary: Twine.Effect<OwnState, Actions, string>;
}

function defaultState(): OwnState {
  return {
    session: null,
    notes: [],
    confirmation: null,
    colorTheme: colorThemes[0],
    colorThemes,
    fontTheme: fontThemes[0],
    fontThemes,
    distractionFree: false,
    isFullscreen: false,
    speechSrc: null,
    voice: "Joey",
    dictionaryShowing: false,
    outlineShowing: false,
    dictionaryResults: []
  };
}

type Api = ReturnType<typeof makeApi>;

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

type Model = WithAsyncLoadingModel<OwnModel>;

export type State = Model["state"];

export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

function getColorThemeFromPreferences(
  preferences: Types.Preferences | undefined
) {
  return preferences
    ? colorThemes.find(theme => theme.name === preferences.colorTheme) ||
        colorThemes[0]
    : colorThemes[0];
}
function getFontThemeFromPreferences(
  preferences: Types.Preferences | undefined
) {
  return preferences
    ? fontThemes.find(theme => theme.name === preferences.fontTheme) ||
        fontThemes[0]
    : fontThemes[0];
}

function makeModel(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setSession(state, session) {
        if (session) {
          cookies.persistAuthToken(session.token);
        } else if (process.env.NODE_ENV === "production") {
          // NB: checking for production solves logging out from
          // hot-module reloading this file since state isn't
          // persisted between hot-module reloads
          cookies.removeAuthToken();
        }
        return {
          ...state,
          session,
          colorTheme: getColorThemeFromPreferences(session.user.preferences),
          fontTheme: getFontThemeFromPreferences(session.user.preferences),
          outlineShowing:
            !!session.user.preferences &&
            session.user.preferences.outlineShowing === true,
          distractionFree:
            !!session.user.preferences &&
            session.user.preferences.distractionFree === true
        };
      },
      setNotes: (state, notes) => ({
        ...state,
        notes: notes.sort((a, b) => (a.dateUpdated > b.dateUpdated ? -1 : 1))
      }),
      setConfirmation: (state, confirmation) => ({
        ...state,
        confirmation
      }),
      setConfirmationLoading: (state, loading) => ({
        ...state,
        confirmation: {
          ...state.confirmation,
          loading
        }
      }),
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
      setFullscreen: (state, isFullscreen) => ({
        ...state,
        isFullscreen
      }),
      setOutlineShowing: (state, outlineShowing) => ({
        ...state,
        outlineShowing
      }),
      setSpeechSrc: (state, speechSrc) => ({
        ...state,
        speechSrc
      }),
      setDictionaryShowing: (state, dictionaryShowing) => ({
        ...state,
        dictionaryShowing,
        dictionaryResults: dictionaryShowing ? state.dictionaryResults : []
      }),
      setDictionaryResults: (state, dictionaryResults) => ({
        ...state,
        dictionaryResults
      })
    },
    effects: {
      async fetchNotes(state, actions) {
        const notes = await api.note.findAll(state.session.token);
        actions.setNotes(notes);
        return notes;
      },
      async createNote(state, actions) {
        const result = await api.note.create(state.session.token, {
          title: `New note - ${new Date().toDateString()}`
        });
        result.map(note => {
          actions.setNotes([note, ...state.notes]);
          if (!isServer()) {
            Router.push(`/?id=${note.id}`);
          }
        });
      },
      async updateNote(state, actions, { noteId, content, title }) {
        const existingNote = state.notes.find(note => note.id === noteId);
        const updates = {
          content,
          title: title ? title : existingNote.title || "Internote"
        };
        const newNote = existingNote
          ? {
              ...existingNote,
              ...updates
            }
          : updates;
        actions.setNotes(
          state.notes.map(n => (n.id === noteId ? { ...n, ...newNote } : n))
        );
        const savedNote = await api.note.updateById(
          state.session.token,
          noteId,
          updates
        );
        savedNote.map(note => {
          actions.setNotes(state.notes.map(n => (n.id === noteId ? note : n)));
        });
      },
      deleteNoteConfirmation(state, actions, { noteId }) {
        const noteToDelete = state.notes.find(note => note.id === noteId);
        actions.setConfirmation({
          copy: `Are you sure you wish to delete ${noteToDelete.title}?`,
          yesText: "Delete",
          async onConfirm() {
            actions.setConfirmationLoading(true);
            await actions.deleteNote({ noteId });
            actions.setConfirmation(null);
          }
        });
      },
      async deleteNote(state, actions, { noteId }) {
        await api.note.deleteById(state.session.token, noteId);
        actions.setNotes(state.notes.filter(note => note.id !== noteId));
      },
      async navigateToFirstNote(_state, actions) {
        const notes = await actions.fetchNotes();
        if (notes.length === 0) {
          await actions.createNote();
        } else if (!isServer()) {
          Router.push(`/?id=${notes[0].id}`);
        }
      },
      async signUp(_state, actions, payload) {
        const session = await api.auth.register(payload);
        actions.setSession(session);
        await actions.navigateToFirstNote();
      },
      async session(_state, actions, { token }) {
        const session = await api.auth.session(token);
        actions.setSession(session);
      },
      async authenticate(_state, actions, payload) {
        const session = await api.auth.login(payload);
        actions.setSession(session);
        await actions.navigateToFirstNote();
      },
      signOutConfirmation(_state, actions) {
        actions.setConfirmation({
          copy: `Are you sure you wish to sign out?`,
          yesText: "Sign out",
          onConfirm() {
            actions.signOut();
            actions.setConfirmation(null);
          }
        });
      },
      async signOut(_state, actions) {
        actions.resetState();
        if (!isServer()) {
          Router.push("/login");
        }
      },
      deleteAccountConfirmation(_state, actions) {
        actions.setConfirmation({
          copy: `Are you sure you wish to delete your account? All of your notes will be removed!`,
          yesText: "Delete account",
          async onConfirm() {
            actions.setConfirmationLoading(true);
            await actions.deleteAccount();
            actions.setConfirmation(null);
          }
        });
      },
      async deleteAccount(state, actions) {
        actions.resetState();
        await api.user.deleteById(state.session.token, state.session.user.id);
        if (!isServer()) {
          Router.push("/register");
        }
      },
      handleApiError(_state, actions, error) {
        if (error.response.status === 401) {
          // TODO: Show a toast message here
          actions.signOut();
        }
      },
      toggleFullscreen(_state, _actions, isFullscreen) {
        // NB: no need to set state here since the window listener does that for us
        if (isFullscreen) {
          requestFullScreen(document.body);
        } else {
          exitFullscreen();
        }
      },
      async requestSpeech(state, actions, { content, noteId }) {
        const result = await api.speech.generate(state.session.token, {
          noteId,
          content,
          voice: state.voice || "Joey"
        });
        result.map(response => actions.setSpeechSrc(response.src));
      },
      async requestDictionary(state, actions, word) {
        actions.setDictionaryShowing(true);
        const response = await api.dictionary.lookup(state.session.token, {
          word
        });
        response.map(({ results }) => actions.setDictionaryResults(results));
      }
    }
  };
  return withAsyncLoading(ownModel);
}

export function makeStore() {
  const api = makeApi(process.env.API_BASE_URL);
  const loggingMiddleware =
    !isServer() && process.env.NODE_ENV !== "production" ? logger : undefined;
  const store = twine<State, Actions>(makeModel(api), [
    loggingMiddleware,
    {
      onStateChange: (state, prevState) => {
        if (state.session && state.session.token) {
          if (state.colorTheme !== prevState.colorTheme) {
            api.preferences.update(state.session.token, {
              colorTheme: state.colorTheme.name
            });
          }
          if (state.fontTheme !== prevState.fontTheme) {
            api.preferences.update(state.session.token, {
              fontTheme: state.fontTheme.name
            });
          }
          if (state.distractionFree !== prevState.distractionFree) {
            api.preferences.update(state.session.token, {
              distractionFree: state.distractionFree
            });
          }
          if (state.voice !== prevState.voice) {
            api.preferences.update(state.session.token, {
              voice: state.voice
            });
          }
          if (state.outlineShowing !== prevState.outlineShowing) {
            api.preferences.update(state.session.token, {
              outlineShowing: state.outlineShowing
            });
          }
        }
      }
    }
  ]);
  api.interceptors.response.use(
    res => res,
    err => {
      console.log(err);
      if (err && err.response) {
        store.actions.handleApiError;
        store.actions.handleApiError(err);
      }
    }
  );

  if (!isServer()) {
    document.addEventListener("fullscreenchange", () => {
      const doc = document as any;

      const fullscreenElm: HTMLElement | null =
        doc.fullscreenElement ||
        doc.mozFullScreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement;

      store.actions.setFullscreen(!!fullscreenElm);
    });
  }

  return store;
}

export type Store = Twine.Return<State, Actions>;

export const Subscribe = makeSubscriber(makeStore());
