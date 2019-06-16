import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Api, InternoteEffect, InternoteEffect0 } from ".";
import { requestFullScreen, exitFullscreen } from "../utilities/fullscreen";
import { isServer } from "../utilities/window";
import Router from "next/router";
import { AxiosError } from "axios";

interface OwnState {
  isFullscreen: boolean;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setFullscreen: Twine.Reducer<OwnState, boolean>;
}

interface OwnEffects {
  navigateToFirstNote: InternoteEffect0<Promise<void>>;
  handleApiError: InternoteEffect<AxiosError>;
  toggleFullscreen: InternoteEffect<boolean>;
}

function defaultState(): OwnState {
  return {
    isFullscreen: false
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  ui: Twine.ModelApi<State, Actions>;
}

export function model(_api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setFullscreen: (state, isFullscreen) => ({
        ...state,
        isFullscreen
      })
    },
    effects: {
      async navigateToFirstNote(_state, actions) {
        const notes = await actions.notes.fetchNotes();
        if (notes.length === 0) {
          await actions.notes.createNote();
        } else if (!isServer()) {
          Router.push(`/?id=${notes[0].id}`);
        }
      },
      handleApiError(_state, actions, error) {
        if (error.response.status === 401) {
          // TODO: Show a toast message here
          actions.auth.signOut();
        }
      },
      toggleFullscreen(_state, _actions, isFullscreen) {
        // NB: no need to set state here since the window listener does that for us
        if (isFullscreen) {
          requestFullScreen(document.body);
        } else {
          exitFullscreen();
        }
      }
    }
  };
  return withAsyncLoading(ownModel, "ui");
}
