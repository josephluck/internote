import { Twine } from "twine-js";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect, makeSetter } from ".";
import { Api } from "../api/api";
import { env } from "../env";
import { makeAttachmentsApi } from "../api/attachments";

interface OwnState {
  speechSrc: string | null;
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setSpeechSrc: Twine.Reducer<OwnState, string | null>;
}

interface OwnEffects {
  requestSpeech: InternoteEffect<{ words: string; id: string }>;
}

function defaultState(): OwnState {
  return {
    speechSrc: null,
  };
}

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  speech: Twine.ModelApi<State, Actions>;
}

const setter = makeSetter<OwnState>();

export function model(api: Api): Model {
  const attachments = makeAttachmentsApi({
    region: env.SERVICES_REGION,
    bucketName: env.SPEECH_BUCKET_NAME,
  });

  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      setSpeechSrc: setter("speechSrc"),
    },
    effects: {
      async requestSpeech(state, actions, { words, id }) {
        const result = await api.speech.create(state.auth.session, {
          id,
          words,
          voice: state.preferences.voice || "Male",
        });
        result.map(async (response) => {
          const src = await attachments.makePresignedUrl(
            state.auth.session,
            response.key
          );
          actions.speech.setSpeechSrc(src);
        });
      },
    },
  };
  return withAsyncLoading(ownModel, "speech");
}
