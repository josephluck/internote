import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0, makeSetter } from ".";
import { Api } from "../api/api";
import {
  CreateSnippetDTO,
  GetSnippetDTO,
} from "@internote/snippets-service/types";

interface OwnState {
  snippets: GetSnippetDTO[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSnippets: Twine.Reducer<OwnState, GetSnippetDTO[]>;
}

interface OwnEffects {
  createSnippet: InternoteEffect<CreateSnippetDTO>;
  fetchSnippets: InternoteEffect0;
  deleteSnippet: InternoteEffect<string>;
}

function defaultState(): OwnState {
  return {
    snippets: [],
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  snippets: Twine.ModelApi<State, Actions>;
}

const setter = makeSetter<OwnState>();

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setSnippets: setter("snippets"),
    },
    effects: {
      async createSnippet(state, actions, snippet) {
        const response = await api.snippets.create(state.auth.session, snippet);
        response.map((s) =>
          actions.snippets.setSnippets([s, ...state.snippets.snippets])
        );
      },
      async fetchSnippets(state, actions) {
        const response = await api.snippets.list(state.auth.session);
        response.map(actions.snippets.setSnippets);
      },
      async deleteSnippet(state, actions, snippetId) {
        const response = await api.snippets.delete(
          state.auth.session,
          snippetId
        );
        response.map(() =>
          actions.snippets.setSnippets(
            state.snippets.snippets.filter((s) => s.snippetId !== snippetId)
          )
        );
      },
    },
  };
  return withAsyncLoading(ownModel, "snippets");
}
