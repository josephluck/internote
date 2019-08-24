import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0 } from ".";
import { Api } from "../api/api";
import { Schema } from "@internote/export-service/types";
import schema from "@internote/export-service/serializers/schema-example";

export interface Snippet {
  title: string;
  content: Schema;
}

interface OwnState {
  snippets: Snippet[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSnippets: Twine.Reducer<OwnState, Snippet[]>;
}

interface OwnEffects {
  createSnippet: InternoteEffect<Snippet>;
  fetchSnippets: InternoteEffect0;
}

function defaultState(): OwnState {
  return {
    snippets: []
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  snippets: Twine.ModelApi<State, Actions>;
}

export function model(_api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setSnippets: (state, snippets) => ({
        ...state,
        snippets
      })
    },
    effects: {
      async createSnippet(_state, _actions, _snippet) {
        // TODO
      },
      async fetchSnippets(_state, actions) {
        // TODO
        return new Promise(resolve => {
          setTimeout(() => {
            actions.snippets.setSnippets([
              {
                title: "Snippet 1",
                content: schema as any
              },
              {
                title: "Snippet 2",
                content: schema as any
              },
              {
                title: "Snippet 3",
                content: schema as any
              }
            ]);
            resolve();
          }, 1000);
        });
      }
    }
  };
  return withAsyncLoading(ownModel, "snippets");
}
