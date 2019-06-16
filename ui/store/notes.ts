import { Twine } from "twine-js";
import * as Types from "@internote/api/domains/types";
import makeApi from "@internote/api/domains/api";
import Router from "next/router";
import { isServer } from "../utilities/window";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect0, InternoteEffect } from ".";
import { Option } from "space-lift";

interface OwnState {
  overwriteCount: number;
  notes: Types.Note[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  incrementOverwriteCount: Twine.Reducer0<OwnState>;
  setNotes: Twine.Reducer<OwnState, Types.Note[]>;
}

export interface UpdateNotePayload {
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
}

function defaultState(): OwnState {
  return {
    overwriteCount: 0,
    notes: []
  };
}

type Api = ReturnType<typeof makeApi>;

type OwnModel = Twine.Model<OwnState, OwnReducers, OwnEffects>;

export type Model = WithAsyncLoadingModel<OwnModel>;
export type State = Model["state"];
export type Actions = Twine.Actions<OwnReducers, OwnEffects>;

export interface Namespace {
  notes: Twine.ModelApi<State, Actions>;
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
      })
    },
    effects: {
      async fetchNotes(state, actions) {
        const notes = await api.note.findAll(state.auth.session.token);
        actions.notes.setNotes(notes);
        return notes;
      },
      async createNote(state, actions) {
        const result = await api.note.create(state.auth.session.token, {
          title: `New note - ${new Date().toDateString()}`,
          tags: []
        });
        result.map(note => {
          actions.notes.setNotes([note, ...state.notes.notes]);
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
        return Option(state.notes.notes.find(note => note.id === noteId)).fold(
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
                  actions.notes.overwriteNoteConfirmation({
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
                actions.notes.setNotes(
                  state.notes.notes.map(n =>
                    n.id === updatedNote.id ? updatedNote : n
                  )
                );
                await actions.tags.fetchTags();
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
            await actions.notes.updateNote({ ...details, overwrite: true });
            await actions.notes.fetchNotes(); // NB: important to get the latest dateUpdated from the server to avoid prompt again
            actions.notes.incrementOverwriteCount(); // HACK: Force the editor to re-render
            actions.confirmation.setConfirmation(null);
          },
          async onCancel() {
            actions.confirmation.setConfirmationCancelLoading(true);
            await actions.notes.fetchNotes(); // NB: important to get the latest dateUpdated from the server to avoid prompt again
            actions.notes.incrementOverwriteCount(); // HACK: Force the editor to re-render
            actions.confirmation.setConfirmation(null);
          }
        });
      },
      deleteNoteConfirmation(state, actions, { noteId }) {
        const noteToDelete = state.notes.notes.find(note => note.id === noteId);
        actions.confirmation.setConfirmation({
          message: `Are you sure you wish to delete ${noteToDelete.title}?`,
          confirmButtonText: "Delete",
          async onConfirm() {
            actions.confirmation.setConfirmationConfirmLoading(true);
            await actions.notes.deleteNote({ noteId });
            actions.confirmation.setConfirmation(null);
          }
        });
      },
      async deleteNote(state, actions, { noteId }) {
        await api.note.deleteById(state.auth.session.token, noteId);
        actions.notes.setNotes(
          state.notes.notes.filter(note => note.id !== noteId)
        );
      }
    }
  };
  return withAsyncLoading(ownModel, "notes");
}
