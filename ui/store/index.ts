import twine, { Twine } from "twine-js";
import * as Types from "@internote/api/types";
import * as fixtures from "@internote/fixtures";

export interface State {
  notes: Types.Note[];
}

interface Reducers {
  setNotes: Twine.Reducer<State, Types.Note[]>;
  setLoading: Twine.Reducer<State, boolean>;
}

interface Effects {
  fetchNotes: Twine.Effect0<State, Actions, Promise<State>>;
  saveNote: Twine.Effect<State, Actions, Types.Note, Promise<State>>;
}

export type Actions = Twine.Actions<Reducers, Effects>;

const model: Twine.Model<State, Reducers, Effects> = {
  state: {
    notes: []
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
    saveNote(state, actions, note) {
      return new Promise(resolve => {
        actions.setLoading(true);
        setTimeout(() => {
          actions.setNotes(
            state.notes.map(n => {
              return n.id === note.id ? note : n;
            })
          );
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
