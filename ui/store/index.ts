import twine, { Twine } from "twine-js";
import * as Types from "@internote/api/domains/types";
import makeApi from "@internote/api/domains/api";
import {
  setAuthenticationCookie,
  removeAuthenticationCookie
} from "../utilities/cookie";
import Router from "next/router";

// TODO: environment variable
const api = makeApi("http://100.115.92.200:2020");

export interface State {
  session: Types.Session | null;
  loading: boolean;
  note: Types.Note | null;
  notes: Types.Note[];
  sidebarOpen: boolean;
  deleteNoteModalOpen: boolean;
}

interface Reducers {
  setSession: Twine.Reducer<State, Types.Session>;
  setNotes: Twine.Reducer<State, Types.Note[]>;
  setNote: Twine.Reducer<State, Types.Note | null>;
  setLoading: Twine.Reducer<State, boolean>;
  setSidebarOpen: Twine.Reducer<State, boolean>;
  setDeleteNoteModalOpen: Twine.Reducer<State, boolean>;
}

interface Effects {
  fetchNotes: Twine.Effect0<State, Actions, Promise<void>>;
  fetchNote: Twine.Effect<State, Actions, string, Promise<void>>;
  newNote: Twine.Effect0<State, Actions, Promise<void>>;
  saveNote: Twine.Effect<State, Actions, { content: string }, Promise<void>>;
  deleteNote: Twine.Effect0<State, Actions, Promise<void>>;
  register: Twine.Effect<
    State,
    Actions,
    { email: string; password: string },
    Promise<void>
  >;
  session: Twine.Effect<State, Actions, string, Promise<void>>;
  authenticate: Twine.Effect<
    State,
    Actions,
    { email: string; password: string },
    Promise<void>
  >;
  logout: Twine.Effect0<State, Actions, void>;
}

export type Actions = Twine.Actions<Reducers, Effects>;

const model: Twine.Model<State, Reducers, Effects> = {
  state: {
    session: null,
    notes: [],
    note: null,
    loading: false,
    sidebarOpen: false,
    deleteNoteModalOpen: false
  },
  reducers: {
    setSession(state, session) {
      if (session) {
        setAuthenticationCookie(session.token);
      } else {
        removeAuthenticationCookie();
      }
      return {
        ...state,
        session
      };
    },
    setLoading(state, loading) {
      return {
        ...state,
        loading
      };
    },
    setNotes(state, notes) {
      return {
        ...state,
        notes
      };
    },
    setNote(state, note) {
      return {
        ...state,
        note
      };
    },
    setSidebarOpen(state, sidebarOpen) {
      return {
        ...state,
        sidebarOpen
      };
    },
    setDeleteNoteModalOpen(state, deleteNoteModalOpen) {
      return {
        ...state,
        deleteNoteModalOpen
      };
    }
  },
  effects: {
    async fetchNotes(state, actions) {
      actions.setLoading(true);
      const notes = await api.note.findAll(state.session.token);
      actions.setNotes(notes);
      actions.setLoading(false);
    },
    async fetchNote(state, actions, id) {
      const existingNote = state.notes.find(note => note.id === id);

      if (existingNote) {
        actions.setNote(existingNote);
      } else {
        actions.setLoading(true);
        const result = await api.note.findById(state.session.token, id);
        result.map(note => {
          actions.setNote(note);
        });
        actions.setLoading(false);
      }
    },
    async newNote(state, actions) {
      actions.setLoading(true);
      const note = await api.note.create(state.session.token, {
        content: "New note"
      });
      Router.push(`/note?id=${note.id}`);
      actions.setLoading(false);
    },
    async saveNote(state, actions, { content }) {
      const newNote = {
        ...state.note,
        content
      };
      actions.setNote(newNote);
      actions.setNotes(
        state.notes.map(note => (note.id === newNote.id ? newNote : note))
      );
      actions.setLoading(true);
      await api.note.updateById(state.session.token, state.note.id, {
        content
      });
      actions.setLoading(false);
    },
    async deleteNote(state, actions) {
      actions.setLoading(true);
      await api.note.deleteById(state.session.token, state.note.id);
      actions.setNotes(await api.note.findAll(state.session.token));
      actions.setNote(null);
      Router.push("/");
    },
    async register(_state, actions, { email, password }) {
      const session = await api.auth.register({ email, password });
      actions.setSession(session);
      Router.push("/");
    },
    async session(_state, actions, token) {
      const session = await api.auth.session(token);
      actions.setSession(session);
    },
    async authenticate(_state, actions, { email, password }) {
      const session = await api.auth.login({ email, password });
      actions.setSession(session);
      Router.push("/");
    },
    async logout(_state, actions) {
      actions.setSession(null);
      Router.push("/login");
    }
  }
};

export function makeStore() {
  return twine<State, Actions>(model);
}

export type Store = Twine.Return<State, Actions>;
