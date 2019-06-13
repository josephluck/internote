import { Twine } from "twine-js";
import * as Types from "@internote/api/domains/types";
import makeApi from "@internote/api/domains/api";
import Router from "next/router";
import { AxiosError } from "axios";
import cookie from "../utilities/cookie";
import { isServer } from "../utilities/window";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Theme, FontTheme, colorThemes, fontThemes } from "../theming/themes";
import { requestFullScreen, exitFullscreen } from "../utilities/fullscreen";
import { InternoteEffect0, InternoteEffect } from ".";

const cookies = cookie();

interface Confirmation {
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => any;
  onCancel?: () => any;
  confirmLoading?: boolean;
  cancelLoading?: boolean;
}

interface OwnState {
  overwriteCount: number;
  session: Types.Session | null;
  notes: Types.Note[];
  confirmation: Confirmation | null;
  isFullscreen: boolean;
  dictionaryShowing: boolean;
  dictionaryResults: Types.DictionaryResult[];
  tags: Types.Tag[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  incrementOverwriteCount: Twine.Reducer0<OwnState>;
  setSession: Twine.Reducer<OwnState, Types.Session>;
  setNotes: Twine.Reducer<OwnState, Types.Note[]>;
  setConfirmation: Twine.Reducer<OwnState, Confirmation | null>;
  setConfirmationConfirmLoading: Twine.Reducer<OwnState, boolean>;
  setConfirmationCancelLoading: Twine.Reducer<OwnState, boolean>;
  setDictionaryShowing: Twine.Reducer<OwnState, boolean>;
  setFullscreen: Twine.Reducer<OwnState, boolean>;
  setDictionaryResults: Twine.Reducer<OwnState, Types.DictionaryResult[]>;
  setTags: Twine.Reducer<OwnState, Types.Tag[]>;
}

interface UpdateNotePayload {
  noteId: string;
  content: {};
  tags: string[];
  title: string | undefined;
  overwrite?: boolean;
}

interface OwnEffects {
  fetchNotes: InternoteEffect0<Promise<Types.Note[]>>;
  createNote: InternoteEffect0;
  updateNote: InternoteEffect<UpdateNotePayload, Promise<void>>;
  overwriteNoteConfirmation: InternoteEffect<UpdateNotePayload>;
  deleteNoteConfirmation: InternoteEffect<{ noteId: string }>;
  deleteNote: InternoteEffect<{ noteId: string }>;
  navigateToFirstNote: InternoteEffect0<Promise<void>>;
  signUp: InternoteEffect<Types.SignupRequest, Promise<void>>;
  storeSession: InternoteEffect<Types.Session>;
  session: InternoteEffect<{ token: string }, Promise<void>>;
  authenticate: InternoteEffect<Types.LoginRequest, Promise<void>>;
  signOutConfirmation: InternoteEffect0<void>;
  signOut: InternoteEffect0;
  deleteAccountConfirmation: InternoteEffect0;
  deleteAccount: InternoteEffect0<Promise<void>>;
  handleApiError: InternoteEffect<AxiosError>;
  toggleFullscreen: InternoteEffect<boolean>;
  requestDictionary: InternoteEffect<string>;
  fetchTags: InternoteEffect0;
  saveNewTag: InternoteEffect<UpdateNotePayload, Promise<void>>;
}

function defaultState(): OwnState {
  return {
    session: null,
    overwriteCount: 0,
    notes: [],
    confirmation: null,
    isFullscreen: false,
    dictionaryShowing: false,
    dictionaryResults: [],
    tags: []
  };
}

type Api = ReturnType<typeof makeApi>;

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  rest: Twine.ModelApi<State, Actions>;
}

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

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      incrementOverwriteCount: state => ({
        ...state,
        overwriteCount: state.overwriteCount + 1
      }),
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
          session
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
      setConfirmationConfirmLoading: (state, confirmLoading) => ({
        ...state,
        confirmation: {
          ...state.confirmation,
          confirmLoading
        }
      }),
      setConfirmationCancelLoading: (state, cancelLoading) => ({
        ...state,
        confirmation: {
          ...state.confirmation,
          cancelLoading
        }
      }),
      setFullscreen: (state, isFullscreen) => ({
        ...state,
        isFullscreen
      }),
      setDictionaryShowing: (state, dictionaryShowing) => ({
        ...state,
        dictionaryShowing,
        dictionaryResults: dictionaryShowing ? state.dictionaryResults : []
      }),
      setDictionaryResults: (state, dictionaryResults) => ({
        ...state,
        dictionaryResults
      }),
      setTags: (state, tags) => ({
        ...state,
        tags
      })
    },
    effects: {
      async fetchNotes(state, actions) {
        const notes = await api.note.findAll(state.rest.session.token);
        actions.rest.setNotes(notes);
        return notes;
      },
      async createNote(state, actions) {
        const result = await api.note.create(state.rest.session.token, {
          title: `New note - ${new Date().toDateString()}`,
          tags: []
        });
        result.map(note => {
          actions.rest.setNotes([note, ...state.rest.notes]);
          if (!isServer()) {
            Router.push(`/?id=${note.id}`);
          }
        });
      },
      async updateNote(
        state,
        actions,
        { noteId, content, title, tags, overwrite = false }
      ) {
        const existingNote = state.rest.notes.find(note => note.id === noteId);
        const savedNote = await api.note.updateById(
          state.rest.session.token,
          noteId,
          {
            content,
            title,
            dateUpdated: existingNote.dateUpdated,
            tags,
            overwrite
          }
        );
        await savedNote.fold(
          err => {
            if (err.type === "overwrite") {
              actions.rest.overwriteNoteConfirmation({
                noteId,
                content,
                tags,
                title
              });
            }
          },
          async updatedNote => {
            // NB: update dateUpdated so that overwrite confirmation
            // works properly
            actions.rest.setNotes(
              state.rest.notes.map(n =>
                n.id === updatedNote.id ? updatedNote : n
              )
            );
            await actions.rest.fetchTags();
          }
        );
      },
      overwriteNoteConfirmation(_state, actions, details) {
        actions.rest.setConfirmation({
          message: `There's a more recent version of ${
            details.title
          }. What do you want to do?`,
          confirmButtonText: "Overwrite",
          cancelButtonText: "Discard",
          async onConfirm() {
            actions.rest.setConfirmationConfirmLoading(true);
            await actions.rest.updateNote({ ...details, overwrite: true });
            await actions.rest.fetchNotes(); // NB: important to get the latest dateUpdated from the server to avoid prompt again
            actions.rest.incrementOverwriteCount(); // HACK: Force the editor to re-render
            actions.rest.setConfirmation(null);
          },
          async onCancel() {
            actions.rest.setConfirmationCancelLoading(true);
            await actions.rest.fetchNotes(); // NB: important to get the latest dateUpdated from the server to avoid prompt again
            actions.rest.incrementOverwriteCount(); // HACK: Force the editor to re-render
            actions.rest.setConfirmation(null);
          }
        });
      },
      deleteNoteConfirmation(state, actions, { noteId }) {
        const noteToDelete = state.rest.notes.find(note => note.id === noteId);
        actions.rest.setConfirmation({
          message: `Are you sure you wish to delete ${noteToDelete.title}?`,
          confirmButtonText: "Delete",
          async onConfirm() {
            actions.rest.setConfirmationConfirmLoading(true);
            await actions.rest.deleteNote({ noteId });
            actions.rest.setConfirmation(null);
          }
        });
      },
      async deleteNote(state, actions, { noteId }) {
        await api.note.deleteById(state.rest.session.token, noteId);
        actions.rest.setNotes(
          state.rest.notes.filter(note => note.id !== noteId)
        );
      },
      async navigateToFirstNote(_state, actions) {
        const notes = await actions.rest.fetchNotes();
        if (notes.length === 0) {
          await actions.rest.createNote();
        } else if (!isServer()) {
          Router.push(`/?id=${notes[0].id}`);
        }
      },
      storeSession(_state, actions, session) {
        actions.rest.setSession(session);
        actions.preferences.setPreferences({
          colorTheme: getColorThemeFromPreferences(session.user.preferences),
          fontTheme: getFontThemeFromPreferences(session.user.preferences),
          outlineShowing:
            !!session.user.preferences &&
            session.user.preferences.outlineShowing === true,
          distractionFree:
            !!session.user.preferences &&
            session.user.preferences.distractionFree === true
        });
      },
      async signUp(_state, actions, payload) {
        const session = await api.auth.register(payload);
        actions.rest.storeSession(session);
        await actions.rest.navigateToFirstNote();
      },
      async session(_state, actions, { token }) {
        const session = await api.auth.session(token);
        actions.rest.storeSession(session);
      },
      async authenticate(_state, actions, payload) {
        const session = await api.auth.login(payload);
        actions.rest.storeSession(session);
        await actions.rest.navigateToFirstNote();
      },
      signOutConfirmation(_state, actions) {
        actions.rest.setConfirmation({
          message: `Are you sure you wish to sign out?`,
          confirmButtonText: "Sign out",
          onConfirm() {
            actions.rest.signOut();
            actions.rest.setConfirmation(null);
          }
        });
      },
      async signOut(_state, actions) {
        actions.rest.resetState();
        if (!isServer()) {
          Router.push("/login");
        }
      },
      deleteAccountConfirmation(_state, actions) {
        actions.rest.setConfirmation({
          message: `Are you sure you wish to delete your account? All of your notes will be removed!`,
          confirmButtonText: "Delete account",
          async onConfirm() {
            actions.rest.setConfirmationConfirmLoading(true);
            await actions.rest.deleteAccount();
            actions.rest.setConfirmation(null);
          }
        });
      },
      async deleteAccount(state, actions) {
        actions.rest.resetState();
        await api.user.deleteById(
          state.rest.session.token,
          state.rest.session.user.id
        );
        if (!isServer()) {
          Router.push("/register");
        }
      },
      handleApiError(_state, actions, error) {
        if (error.response.status === 401) {
          // TODO: Show a toast message here
          actions.rest.signOut();
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
      async requestDictionary(state, actions, word) {
        actions.rest.setDictionaryShowing(true);
        const response = await api.dictionary.lookup(state.rest.session.token, {
          word
        });
        response.map(({ results }) =>
          actions.rest.setDictionaryResults(results)
        );
      },
      async fetchTags(state, actions) {
        const response = await api.tag.getAll(state.rest.session.token);
        response.map(actions.rest.setTags);
      },
      async saveNewTag(_state, actions, payload) {
        // NB: own effect for the purpose of loading state
        // internally all we need to do is save the note (tags are automatically updated)
        await actions.rest.updateNote(payload);
      }
    }
  };
  return withAsyncLoading(ownModel);
}
