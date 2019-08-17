import { makeServiceWorkerApi } from "./api";
import { NotesDbInterface, NoteIndex, NoteIndexState } from "./db";
import { defaultNote } from "@internote/notes-service/db/default-note";
import { Api } from "../api/api";
import { Ok } from "space-lift";
import uuid from "uuid";

function makeMockedApi(): Api {
  const api: Partial<Api> = {
    notes: {
      get: jest.fn((_session, noteId) =>
        Promise.resolve(
          Ok({
            ...defaultNote,
            noteId,
            userId: uuid()
          })
        )
      ),
      create: jest.fn((_session, body) =>
        Promise.resolve(
          Ok({
            ...defaultNote,
            ...body,
            noteId: uuid(),
            userId: uuid()
          })
        )
      ),
      update: jest.fn((_session, noteId, body) =>
        Promise.resolve(
          Ok({
            ...defaultNote,
            ...body,
            noteId,
            userId: uuid()
          })
        )
      ),
      list: jest.fn(() =>
        Promise.resolve(
          Ok([defaultNote, defaultNote, defaultNote, defaultNote])
        )
      ),
      delete: jest.fn(() => Promise.resolve(Ok({} as any)))
    }
  };

  return (api as any) as Api;
}

function makeMockedDb(initialNotes: NoteIndex[]): Partial<NotesDbInterface> {
  let notes = initialNotes;
  const db = {
    remove(id: string) {
      notes.filter(n => n.noteId !== id);
      return Promise.resolve();
    },
    add(note: NoteIndex) {
      const noteId = uuid();
      notes.push({ ...note, noteId });
      return Promise.resolve(noteId);
    },
    get(id: string) {
      return Promise.resolve(notes.find(n => n.noteId === id));
    },
    update(id: string, note: NoteIndex) {
      notes.map(n => (n.noteId === id ? { ...n, ...note } : n));
      return Promise.resolve(1); // TODO: this seems odd
    },
    getUnsynced(filter: (note: NoteIndex) => boolean) {
      return Promise.resolve(Object.values(notes).filter(filter));
    }
  };
  return db as Partial<NotesDbInterface>;
}

describe("SW / api sync", () => {
  it("Syncs a new note with the server", async () => {
    const api = makeMockedApi();
    const db = makeMockedDb([
      {
        ...defaultNote,
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      },
      {
        ...defaultNote,
        synced: false,
        createOnServer: true,
        state: "UPDATE" as NoteIndexState
      }
    ]);
    const service = makeServiceWorkerApi(db as NotesDbInterface, api);
    await service.syncNotesFromIndexToServer();
    expect(api.notes.create).toBeCalledTimes(1);
  });
});
