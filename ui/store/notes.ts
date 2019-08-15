import { Twine } from "twine-js";
import Router from "next/router";
import { isServer } from "../utilities/window";
import { withAsyncLoading, WithAsyncLoadingModel } from "./with-async-loading";
import { InternoteEffect0, InternoteEffect } from ".";
import { Api } from "../api/api";
import { GetNoteDTO } from "@internote/notes-service/types";

interface OwnState {
  overwriteCount: number;
  notes: GetNoteDTO[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  incrementOverwriteCount: Twine.Reducer0<OwnState>;
  setNotes: Twine.Reducer<OwnState, GetNoteDTO[]>;
}

export interface UpdateNotePayload {
  noteId: string;
  content: {};
  tags: string[];
  title: string | undefined;
  overwrite?: boolean;
}

interface OwnEffects {
  fetchNotes: InternoteEffect0<Promise<GetNoteDTO[]>>;
  createNote: InternoteEffect0;
  updateNote: InternoteEffect<UpdateNotePayload, Promise<void>>;
  syncNotes: InternoteEffect<{ overwrite: boolean }, Promise<void>>;
  overwriteNotesConfirmation: InternoteEffect<{ message: string }>;
  deleteNoteConfirmation: InternoteEffect<{ noteId: string }>;
  deleteNote: InternoteEffect<{ noteId: string }>;
}

function defaultState(): OwnState {
  return {
    overwriteCount: 0,
    notes: []
  };
}

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
        // notes: notes.sort((a, b) => (a.dateUpdated > b.dateUpdated ? -1 : 1))
        notes
      })
    },
    effects: {
      async fetchNotes(state, actions) {
        const response = await api.notes.list(state.auth.session);
        return response.fold(
          () => [],
          notes => {
            actions.notes.setNotes(notes);
            return notes;
          }
        );
      },
      async createNote(state, actions) {
        const result = await api.notes.create(state.auth.session, {
          title: `New note - ${new Date().toDateString()}`
        });
        result.map(note => {
          actions.notes.setNotes([note, ...state.notes.notes]);
          if (!isServer()) {
            Router.push(`/?id=${note.noteId}`);
          }
        });
      },
      async updateNote(state, actions, { noteId, content, title, tags }) {
        actions.notes.setNotes(
          state.notes.notes.map(note =>
            note.noteId === noteId ? { ...note, content, title, tags } : note
          )
        );
        actions.notes.syncNotes({ overwrite: false });
      },
      async syncNotes(state, actions) {
        // NB: don't allow concurrent requests
        // TODO: revisit this
        if (state.notes.loading.syncNotes) {
          return;
        }
        const updates = state.notes.notes.map(note => ({
          noteId: note.noteId,
          userId: note.userId,
          title: note.title,
          content: note.content,
          tags: note.tags,
          dateUpdated: note.dateUpdated
        }));
        const result = await api.notes.sync(state.auth.session, {
          notes: updates
        });
        result.fold(
          err => {
            actions.notes.overwriteNotesConfirmation({ message: err.message });
          },
          notes => {
            actions.notes.setNotes(notes);
          }
        );
      },
      overwriteNotesConfirmation(_state, actions, { message }) {
        actions.confirmation.setConfirmation({
          message,
          confirmButtonText: "Overwrite",
          cancelButtonText: "Discard",
          async onConfirm() {
            actions.confirmation.setConfirmationConfirmLoading(true);
            await actions.notes.syncNotes({ overwrite: true });
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
        const noteToDelete = state.notes.notes.find(
          note => note.noteId === noteId
        );
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
        await api.notes.delete(state.auth.session, noteId);
        actions.notes.setNotes(
          state.notes.notes.filter(note => note.noteId !== noteId)
        );
      }
    }
  };
  return withAsyncLoading(ownModel, "notes");
}
