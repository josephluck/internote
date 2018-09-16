import twine, { Twine } from "twine-js";
import * as Types from "@internote/api/types";
import * as fixtures from "@internote/fixtures";

export interface State {
  loading: boolean;
  note: Types.Note;
  notes: Types.Note[];
}

interface Reducers {
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
}

export type Actions = Twine.Actions<Reducers, Effects>;

const model: Twine.Model<State, Reducers, Effects> = {
  state: {
    notes: [],
    note: null,
    loading: false
  },
  reducers: {
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
          actions.setNotes([fixtures.note(), fixtures.note(), fixtures.note()]);
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
          actions.setNote(fixtures.note());
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
    }
  }
};

export function makeStore() {
  return twine<State, Actions>(model);
}
