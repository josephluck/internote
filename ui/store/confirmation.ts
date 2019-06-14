import { Twine } from "twine-js";
import { Api } from ".";

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
  confirmation: Confirmation | null;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setConfirmation: Twine.Reducer<OwnState, Confirmation | null>;
  setConfirmationConfirmLoading: Twine.Reducer<OwnState, boolean>;
  setConfirmationCancelLoading: Twine.Reducer<OwnState, boolean>;
}

interface OwnEffects {}

function defaultState(): OwnState {
  return {
    confirmation: null
  };
}

export type Model = Twine.Model<OwnState, OwnReducers, OwnEffects>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  confirmation: Twine.ModelApi<State, Actions>;
}

export function model(_api: Api): Model {
  return {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
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
      })
    },
    effects: {}
  };
}
