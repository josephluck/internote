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

const cookies = cookie();

interface OwnState {
  session: Types.Session | null;
  note: Types.Note | null;
  noteToDelete: Types.Note | null;
  notes: Types.Note[];
  sidebarOpen: boolean;
  deleteNoteModalOpen: boolean;
  signOutModalOpen: boolean;
  deleteAccountModalOpen: boolean;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSession: Twine.Reducer<OwnState, Types.Session>;
  setNotes: Twine.Reducer<OwnState, Types.Note[]>;
  setNote: Twine.Reducer<OwnState, Types.Note | null>;
  setNoteToDelete: Twine.Reducer<OwnState, Types.Note | null>;
  setSidebarOpen: Twine.Reducer<OwnState, boolean>;
  setDeleteNoteModalOpen: Twine.Reducer<OwnState, boolean>;
  setSignOutModalOpen: Twine.Reducer<OwnState, boolean>;
  setDeleteAccountModalOpen: Twine.Reducer<OwnState, boolean>;
}

interface OwnEffects {
  fetchNotes: Twine.Effect0<OwnState, Actions, Promise<Types.Note[]>>;
  fetchNote: Twine.Effect<OwnState, Actions, { noteId: string }, Promise<void>>;
  createNote: Twine.Effect0<OwnState, Actions, Promise<Types.Note>>;
  updateNote: Twine.Effect<
    OwnState,
    Actions,
    { content: string; title: string | undefined },
    Promise<void>
  >;
  startDeleteNoteFlow: Twine.Effect<
    OwnState,
    Actions,
    { noteId: string },
    Promise<void>
  >;
  deleteNote: Twine.Effect<
    OwnState,
    Actions,
    { noteId: string },
    Promise<void>
  >;
  navigateToFirstNote: Twine.Effect0<OwnState, Actions, Promise<void>>;
  signUp: Twine.Effect<OwnState, Actions, Types.SignupRequest, Promise<void>>;
  session: Twine.Effect<OwnState, Actions, { token: string }, Promise<void>>;
  authenticate: Twine.Effect<
    OwnState,
    Actions,
    Types.LoginRequest,
    Promise<void>
  >;
  signOut: Twine.Effect0<OwnState, Actions, void>;
  deleteAccount: Twine.Effect0<OwnState, Actions, Promise<void>>;
  handleApiError: Twine.Effect<OwnState, Actions, AxiosError>;
}

function defaultState(): OwnState {
  return {
    session: null,
    notes: [],
    note: null,
    noteToDelete: null,
    sidebarOpen: false,
    deleteNoteModalOpen: false,
    signOutModalOpen: false,
    deleteAccountModalOpen: false
  };
}

type Api = ReturnType<typeof makeApi>;

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

type Model = WithAsyncLoadingModel<OwnModel>;

export type State = Model["state"];

export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

function makeModel(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: defaultState,
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
      setNote: (state, note) => ({
        ...state,
        note
      }),
      setNoteToDelete: (state, noteToDelete) => ({
        ...state,
        noteToDelete
      }),
      setSidebarOpen: (state, sidebarOpen) => ({
        ...state,
        sidebarOpen
      }),
      setDeleteNoteModalOpen: (state, deleteNoteModalOpen) => ({
        ...state,
        deleteNoteModalOpen
      }),
      setSignOutModalOpen: (state, signOutModalOpen) => ({
        ...state,
        signOutModalOpen
      }),
      setDeleteAccountModalOpen: (state, deleteAccountModalOpen) => ({
        ...state,
        deleteAccountModalOpen
      })
    },
    effects: {
      async fetchNotes(state, actions) {
        const notes = await api.note.findAll(state.session.token);
        actions.setNotes(notes);
        return notes;
      },
      async fetchNote(state, actions, { noteId }) {
        const existingNote = state.notes.find(note => note.id === noteId);
        if (existingNote) {
          actions.setNote(existingNote);
        } else {
          const result = await api.note.findById(state.session.token, noteId);
          result.map(actions.setNote);
        }
      },
      async createNote(state, actions) {
        const note = await api.note.create(state.session.token, {
          title: `New note - ${new Date().toDateString()}`
        });
        actions.setNote(note);
        Router.push(`/?id=${note.id}`);
        return note;
      },
      async updateNote(state, actions, { content, title }) {
        const updates = { content, title: title ? title : state.note.title };
        const newNote = {
          ...state.note,
          ...updates
        };
        actions.setNote(newNote);
        const savedNote = await api.note.updateById(
          state.session.token,
          newNote.id,
          updates
        );
        actions.setNotes(
          state.notes.map(note => (note.id === newNote.id ? savedNote : note))
        );
      },
      async startDeleteNoteFlow(state, actions, { noteId }) {
        actions.setNoteToDelete(state.notes.find(note => note.id === noteId));
        actions.setDeleteNoteModalOpen(true);
      },
      async deleteNote(state, actions, { noteId }) {
        // NB: This cannot setNote(null) since we have an `OnMount` component which performs navigateToFirstNote() which will get triggered if we do
        await api.note.deleteById(state.session.token, noteId);
        actions.setNotes(state.notes.filter(note => note.id !== noteId));
        actions.setDeleteNoteModalOpen(false);
        actions.setNoteToDelete(null);
        await actions.navigateToFirstNote();
      },
      async navigateToFirstNote(_state, actions) {
        const notes = await actions.fetchNotes();
        if (notes.length === 0) {
          await actions.createNote();
        } else {
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
      async signOut(_state, actions) {
        actions.resetState();
        Router.push("/login");
      },
      async deleteAccount(state, actions) {
        actions.resetState();
        await api.user.deleteById(state.session.token, state.session.user.id);
        Router.push("/register");
      },
      handleApiError(_state, actions, error) {
        if (error.response.status === 401) {
          // TODO: Show a toast message here
          actions.signOut();
        }
      }
    }
  };
  return withAsyncLoading(ownModel);
}

export function makeStore() {
  const api = makeApi(process.env.API_BASE_URL);
  const store = twine<State, Actions>(
    makeModel(api),
    !isServer() ? logger : undefined
  );
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
  return store;
}

export type Store = Twine.Return<State, Actions>;

export const Subscribe = makeSubscriber(makeStore());
