import { Twine } from "twine-js";
import * as Types from "@internote/api/domains/types";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { Api, InternoteEffect, InternoteEffect0 } from ".";
import { UpdateNotePayload } from "./notes";

interface OwnState {
  tags: Types.Tag[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setTags: Twine.Reducer<OwnState, Types.Tag[]>;
}

interface OwnEffects {
  fetchTags: InternoteEffect0;
  saveNewTag: InternoteEffect<UpdateNotePayload, Promise<void>>;
}

function defaultState(): OwnState {
  return {
    tags: []
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  tags: Twine.ModelApi<State, Actions>;
}

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setTags: (state, tags) => ({
        ...state,
        tags
      })
    },
    effects: {
      async fetchTags(state, actions) {
        const response = await api.tag.getAll(state.auth.session.token);
        response.map(actions.tags.setTags);
      },
      async saveNewTag(_state, actions, payload) {
        // NB: own effect for the purpose of loading state
        // internally all we need to do is save the note (tags are automatically updated)
        await actions.notes.updateNote(payload);
      }
    }
  };
  return withAsyncLoading(ownModel, "tags");
}
