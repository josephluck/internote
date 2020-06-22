import { InternoteEditorValue } from "@internote/lib/editor-types";
import { EMPTY_SCHEMA } from "@internote/lib/schema-examples";
import { GetNoteDTO } from "@internote/notes-service/types";
import Router from "next/router";
import { Option } from "space-lift";
import { Twine } from "twine-js";

import { Api } from "../api/api";
import { isServer } from "../utilities/window";
import { WithAsyncLoadingModel, withAsyncLoading } from "./with-async-loading";
import { InternoteEffect, InternoteEffect0 } from ".";

interface OwnState {
  notes: GetNoteDTO[];
}

interface OwnReducers {
  resetState: Twine.Reducer0<OwnState>;
  setNotes: Twine.Reducer<OwnState, GetNoteDTO[]>;
}

export interface UpdateNotePayload {
  noteId: string;
  content: InternoteEditorValue;
  tags: string[];
  title: string | undefined;
}

interface OwnEffects {
  fetchNotes: InternoteEffect0<Promise<GetNoteDTO[]>>;
  createNote: InternoteEffect0;
  updateNote: InternoteEffect<UpdateNotePayload, Promise<void>>;
  deleteNoteConfirmation: InternoteEffect<{ noteId: string }>;
  deleteNote: InternoteEffect<{ noteId: string }>;
}

function defaultState(): OwnState {
  return {
    notes: [],
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
      setNotes: (state, notes) => ({
        ...state,
        notes: notes.sort((a, b) => (a.dateUpdated > b.dateUpdated ? -1 : 1)),
      }),
    },
    effects: {
      async fetchNotes(state, actions) {
        const response = await api.notes.list(state.auth.session);
        return response.fold(
          () => [],
          (notes) => {
            actions.notes.setNotes(notes);
            return notes;
          }
        );
      },
      async createNote(state, actions) {
        const result = await api.notes.create(state.auth.session, {
          title: `New note - ${new Date().toDateString()}`,
          content: EMPTY_SCHEMA,
        });
        result.map((note) => {
          actions.notes.setNotes([note, ...state.notes.notes]);
          if (!isServer()) {
            Router.push(`/?id=${note.noteId}`);
          }
        });
      },
      async updateNote(state, actions, { noteId, content, title, tags }) {
        return Option(
          state.notes.notes.find((note) => note.noteId === noteId)
        ).fold(
          () => Promise.resolve(),
          async (existingNote) => {
            const savedNote = await api.notes.update(
              state.auth.session,
              noteId,
              {
                content,
                title,
                dateUpdated: existingNote.dateUpdated,
                tags,
              }
            );
            await savedNote.fold(
              () => {},
              async (updatedNote) => {
                actions.notes.setNotes(
                  state.notes.notes.map((n) =>
                    n.noteId === updatedNote.noteId ? updatedNote : n
                  )
                );
                await actions.tags.fetchTags();
              }
            );
          }
        );
      },
      deleteNoteConfirmation(state, actions, { noteId }) {
        const noteToDelete = state.notes.notes.find(
          (note) => note.noteId === noteId
        );
        actions.confirmation.setConfirmation({
          message: `Are you sure you wish to delete ${noteToDelete.title}?`,
          confirmButtonText: "Delete",
          async onConfirm() {
            actions.confirmation.setConfirmationConfirmLoading(true);
            await actions.notes.deleteNote({ noteId });
            actions.confirmation.setConfirmation(null);
          },
        });
      },
      async deleteNote(state, actions, { noteId }) {
        await api.notes.delete(state.auth.session, noteId);
        actions.notes.setNotes(
          state.notes.notes.filter((note) => note.noteId !== noteId)
        );
      },
    },
  };
  return withAsyncLoading(ownModel, "notes");
}
