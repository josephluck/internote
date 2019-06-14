import { Twine } from "twine-js";
import * as Types from "@internote/api/domains/types";
import makeApi from "@internote/api/domains/api";
import Router from "next/router";
import { AxiosError } from "axios";
import { isServer } from "../utilities/window";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { requestFullScreen, exitFullscreen } from "../utilities/fullscreen";
import { InternoteEffect0, InternoteEffect } from ".";
import { Option } from "space-lift";

interface OwnState {
  overwriteCount: number;
  notes: Types.Note[];
  isFullscreen: boolean;
  tags: Types.Tag[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  incrementOverwriteCount: Twine.Reducer0<OwnState>;
  setNotes: Twine.Reducer<OwnState, Types.Note[]>;
  setFullscreen: Twine.Reducer<OwnState, boolean>;
  setTags: Twine.Reducer<OwnState, Types.Tag[]>;
}

interface UpdateNotePayload {
  noteId: string;
  content: {};
  tags: string[];
  title: string | undefined;
  overwrite?: boolean;
}

interface OwnEffects {
  fetchNotes: InternoteEffect0<Promise<Types.Note[]>>;
  createNote: InternoteEffect0;
  updateNote: InternoteEffect<UpdateNotePayload, Promise<void>>;
  overwriteNoteConfirmation: InternoteEffect<UpdateNotePayload>;
  deleteNoteConfirmation: InternoteEffect<{ noteId: string }>;
  deleteNote: InternoteEffect<{ noteId: string }>;
  navigateToFirstNote: InternoteEffect0<Promise<void>>;
  handleApiError: InternoteEffect<AxiosError>;
  toggleFullscreen: InternoteEffect<boolean>;
  fetchTags: InternoteEffect0;
  saveNewTag: InternoteEffect<UpdateNotePayload, Promise<void>>;
}

function defaultState(): OwnState {
  return {
    overwriteCount: 0,
    notes: [],
    isFullscreen: false,
    tags: []
  };
}

type Api = ReturnType<typeof makeApi>;

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  rest: Twine.ModelApi<State, Actions>;
}

export function model(api: Api): Model {
  const ownModel: OwnModel = {
    state: defaultState(),
    reducers: {
      resetState: () => defaultState(),
      incrementOverwriteCount: state => ({
        ...state,
        overwriteCount: state.overwriteCount + 1
      }),
      setNotes: (state, notes) => ({
        ...state,
        notes: notes.sort((a, b) => (a.dateUpdated > b.dateUpdated ? -1 : 1))
      }),
      setFullscreen: (state, isFullscreen) => ({
        ...state,
        isFullscreen
      }),
      setTags: (state, tags) => ({
        ...state,
        tags
      })
    },
    effects: {
      async fetchNotes(state, actions) {
        const notes = await api.note.findAll(state.auth.session.token);
        actions.rest.setNotes(notes);
        return notes;
      },
      async createNote(state, actions) {
        const result = await api.note.create(state.auth.session.token, {
          title: `New note - ${new Date().toDateString()}`,
          tags: []
        });
        result.map(note => {
          actions.rest.setNotes([note, ...state.rest.notes]);
          if (!isServer()) {
            Router.push(`/?id=${note.id}`);
          }
        });
      },
      async updateNote(
        state,
        actions,
        { noteId, content, title, tags, overwrite = false }
      ) {
        return Option(state.rest.notes.find(note => note.id === noteId)).fold(
          () => Promise.resolve(),
          async ({ dateUpdated }) => {
            const savedNote = await api.note.updateById(
              state.auth.session.token,
              noteId,
              {
                content,
                title,
                dateUpdated,
                tags,
                overwrite
              }
            );
            await savedNote.fold(
              err => {
                if (err.type === "overwrite") {
                  actions.rest.overwriteNoteConfirmation({
                    noteId,
                    content,
                    tags,
                    title
                  });
                }
              },
              async updatedNote => {
                // NB: update dateUpdated so that overwrite confirmation
                // works properly
                actions.rest.setNotes(
                  state.rest.notes.map(n =>
                    n.id === updatedNote.id ? updatedNote : n
                  )
                );
                await actions.rest.fetchTags();
              }
            );
          }
        );
      },
      overwriteNoteConfirmation(_state, actions, details) {
        actions.confirmation.setConfirmation({
          message: `There's a more recent version of ${
            details.title
          }. What do you want to do?`,
          confirmButtonText: "Overwrite",
          cancelButtonText: "Discard",
          async onConfirm() {
            actions.confirmation.setConfirmationConfirmLoading(true);
            await actions.rest.updateNote({ ...details, overwrite: true });
            await actions.rest.fetchNotes(); // NB: important to get the latest dateUpdated from the server to avoid prompt again
            actions.rest.incrementOverwriteCount(); // HACK: Force the editor to re-render
            actions.confirmation.setConfirmation(null);
          },
          async onCancel() {
            actions.confirmation.setConfirmationCancelLoading(true);
            await actions.rest.fetchNotes(); // NB: important to get the latest dateUpdated from the server to avoid prompt again
            actions.rest.incrementOverwriteCount(); // HACK: Force the editor to re-render
            actions.confirmation.setConfirmation(null);
          }
        });
      },
      deleteNoteConfirmation(state, actions, { noteId }) {
        const noteToDelete = state.rest.notes.find(note => note.id === noteId);
        actions.confirmation.setConfirmation({
          message: `Are you sure you wish to delete ${noteToDelete.title}?`,
          confirmButtonText: "Delete",
          async onConfirm() {
            actions.confirmation.setConfirmationConfirmLoading(true);
            await actions.rest.deleteNote({ noteId });
            actions.confirmation.setConfirmation(null);
          }
        });
      },
      async deleteNote(state, actions, { noteId }) {
        await api.note.deleteById(state.auth.session.token, noteId);
        actions.rest.setNotes(
          state.rest.notes.filter(note => note.id !== noteId)
        );
      },
      async navigateToFirstNote(_state, actions) {
        const notes = await actions.rest.fetchNotes();
        if (notes.length === 0) {
          await actions.rest.createNote();
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
      },
      async fetchTags(state, actions) {
        const response = await api.tag.getAll(state.auth.session.token);
        response.map(actions.rest.setTags);
      },
      async saveNewTag(_state, actions, payload) {
        // NB: own effect for the purpose of loading state
        // internally all we need to do is save the note (tags are automatically updated)
        await actions.rest.updateNote(payload);
      }
    }
  };
  return withAsyncLoading(ownModel);
}
