import { Twine } from "twine-js";

import { Api } from "../api/api";
import { UpdateNotePayload } from "./notes";
import { WithAsyncLoadingModel, withAsyncLoading } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0, makeSetter } from ".";

interface OwnState {
  tags: string[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setTags: Twine.Reducer<OwnState, string[]>;
}

interface OwnEffects {
  fetchTags: InternoteEffect0;
  saveNewTag: InternoteEffect<UpdateNotePayload, Promise<void>>;
}

function defaultState(): OwnState {
  return {
    tags: [],
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  tags: Twine.ModelApi<State, Actions>;
}

const setter = makeSetter<OwnState>();

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setTags: setter("tags"),
    },
    effects: {
      async fetchTags(state, actions) {
        const response = await api.tags.list(state.auth.session);
        response.map(actions.tags.setTags);
      },
      async saveNewTag(_state, actions, payload) {
        // NB: own effect for the purpose of loading state inside tags drawer...
        // internally all we need to do is save the current note
        await actions.notes.updateNote(payload);
      },
    },
  };
  return withAsyncLoading(ownModel, "tags");
}