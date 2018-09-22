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
}

interface Reducers {
  setSession: Twine.Reducer<State, Types.Session>;
  setNotes: Twine.Reducer<State, Types.Note[]>;
  setNote: Twine.Reducer<State, Types.Note | null>;
  setLoading: Twine.Reducer<State, boolean>;
}

interface Effects {
  fetchNotes: Twine.Effect0<State, Actions, Promise<void>>;
  fetchNote: Twine.Effect<State, Actions, string, Promise<void>>;
  saveNote: Twine.Effect<
    State,
    Actions,
    { id: string; content: string },
    Promise<void>
  >;
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
    loading: false
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
      const existingNote = state.notes.find(n => n.id === id);
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
    saveNote(state, actions, { content }) {
      return new Promise(() => {
        actions.setLoading(true);
        actions.setNote({ ...state.note, content });
        setTimeout(() => {
          actions.setLoading(false);
        }, 1000);
      });
    },
    async register(_state, actions, { email, password }) {
      const session = await api.auth.register({ email, password });
      actions.setSession(session);
      Router.push("/");
    },
    async session(_state, actions, token) {
      const session = await api.auth.session(token);
      console.log(session);
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
