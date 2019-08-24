import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect } from ".";
import { Api } from "../api/api";
import { isServer } from "../utilities/window";

interface OwnState {}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
}

interface OwnEffects {
  markdown: InternoteEffect<{ noteId: string }, Promise<void>>;
  html: InternoteEffect<{ noteId: string }, Promise<void>>;
}

function defaultState(): OwnState {
  return {};
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  exportNote: Twine.ModelApi<State, Actions>;
}

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState()
    },
    effects: {
      async markdown(state, _actions, { noteId }) {
        const { content, title } = state.notes.notes.find(
          n => n.noteId === noteId
        );
        const result = await api.exportNote.markdown(state.auth.session, {
          content,
          title
        } as any); // TODO: improve type of NoteDTO to include new schema types from export service
        result.map(response => {
          if (!isServer()) {
            window.open(response.src, "_blank");
          }
        });
      },
      async html(state, _actions, { noteId }) {
        const { content, title } = state.notes.notes.find(
          n => n.noteId === noteId
        );
        const result = await api.exportNote.html(state.auth.session, {
          content,
          title
        } as any); // TODO: improve type of NoteDTO to include new schema types from export service
        result.map(response => {
          if (!isServer()) {
            window.open(response.src, "_blank");
          }
        });
      }
    }
  };
  return withAsyncLoading(ownModel, "exportNote");
}
