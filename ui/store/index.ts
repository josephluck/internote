import twine, { Twine } from "twine-js";
import * as Types from "@internote/api/domains/types";
import makeApi from "@internote/api/domains/api";

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
  fetchNotes: Twine.Effect0<State, Actions, Promise<State>>;
  fetchNote: Twine.Effect<State, Actions, string, Promise<State>>;
  saveNote: Twine.Effect<
    State,
    Actions,
    { id: string; content: string },
    Promise<State>
  >;

  register: Twine.Effect<
    State,
    Actions,
    { email: string; password: string },
    Promise<State>
  >;
  authenticate: Twine.Effect<
    State,
    Actions,
    { email: string; password: string },
    Promise<State>
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
    fetchNotes(_state, actions) {
      return new Promise(resolve => {
        actions.setLoading(true);
        setTimeout(() => {
          actions.setNotes([]);
          const newState = actions.setLoading(false);
          resolve(newState);
        }, 1000);
      });
    },
    fetchNote(state, actions, id) {
      return new Promise(resolve => {
        actions.setLoading(true);
        const existingNote = state.notes.find(n => n.id === id);
        if (existingNote) {
          actions.setNote(existingNote);
        }
        setTimeout(() => {
          actions.setLoading(false);
          resolve();
        }, 1000);
      });
    },
    saveNote(state, actions, { content }) {
      return new Promise(resolve => {
        actions.setLoading(true);
        actions.setNote({ ...state.note, content });
        setTimeout(() => {
          const newState = actions.setLoading(false);
          resolve(newState);
        }, 1000);
      });
    },
    async register(_state, actions, { email, password }) {
      const session = await api.auth.register({ email, password });
      console.log(session);
      return actions.setSession(session);
    },
    async authenticate(_state, actions, { email, password }) {
      const session = await api.auth.login({ email, password });
      console.log(session);
      // TODO: store token in cookies
      // Add effect to re-authenticate via cookie when app starts
      // Use above effect inside with-auth HOC and handle failure case
      return actions.setSession(session);
    },
    async logout(_state, actions) {
      // TODO: redirect user to login page
      actions.setSession(null);
    }
  }
};

export function makeStore() {
  return twine<State, Actions>(model);
}
