import { makeServiceWorkerApi } from "./api";
import { NotesDbInterface, NoteIndex, NoteIndexState } from "./db";
import { defaultNote } from "@internote/notes-service/db/default-note";
import { Api } from "../api/api";
import { Ok } from "space-lift";
import uuid from "uuid";
import { GetNoteDTO } from "@internote/notes-service/types";

function makeMockedApi(initialNotes: GetNoteDTO[]): Api {
  let notes = initialNotes;
  const api: Partial<Api> = {
    notes: {
      list: jest.fn(() => {
        return Promise.resolve(Ok(notes));
      }),
      get: jest.fn((_session, noteId) => {
        return Promise.resolve(Ok(notes.find(n => n.noteId === noteId)));
      }),
      create: jest.fn((_session, body) => {
        const note = {
          ...defaultNote,
          ...body,
          noteId: uuid(),
          userId: uuid()
        };
        notes = [...notes, note];
        return Promise.resolve(Ok(note));
      }),
      update: jest.fn((_session, noteId, body) => {
        const note = {
          ...defaultNote,
          ...body,
          noteId
        };
        notes = notes.map(n => (n.noteId === noteId ? note : n));
        return Promise.resolve(Ok(note));
      }),
      delete: jest.fn((_session, noteId) => {
        notes = notes.filter(n => n.noteId !== noteId);
        return Promise.resolve(Ok({} as any));
      })
    }
  };

  return (api as any) as Api;
}

function makeMockedNotesDbInterface(
  initialNotes: NoteIndex[]
): Partial<NotesDbInterface> {
  let notes = initialNotes;
  const db = {
    getAll() {
      return Promise.resolve(notes);
    },
    getUnsynced(filter: (note: NoteIndex) => boolean) {
      return Promise.resolve(notes.filter(n => !n.synced && filter(n)));
    },
    get(id: string) {
      return Promise.resolve(notes.find(n => n.noteId === id));
    },
    add(note: NoteIndex) {
      notes = [...notes, note];
      return Promise.resolve(note.noteId);
    },
    update(id: string, note: NoteIndex) {
      notes = notes.map(n => (n.noteId === id ? { ...n, ...note } : n));
      return Promise.resolve(1); // TODO: this seems odd that the return is a number and not a string
    },
    remove(id: string) {
      notes = notes.filter(n => n.noteId !== id);
      return Promise.resolve();
    }
  };
  return db as Partial<NotesDbInterface>;
}

describe("SW / api sync", () => {
  it("Syncs a new note with the server", async () => {
    const api = makeMockedApi([
      { ...defaultNote, noteId: "a" },
      { ...defaultNote, noteId: "b" }
    ]);
    const notesDbInterface = makeMockedNotesDbInterface([
      {
        ...defaultNote,
        noteId: "a",
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      },
      {
        ...defaultNote,
        noteId: "b",
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      },
      {
        ...defaultNote,
        noteId: "c",
        synced: false,
        createOnServer: true,
        state: "UPDATE" as NoteIndexState
      }
    ]);
    const service = makeServiceWorkerApi(
      notesDbInterface as NotesDbInterface,
      api
    );
    await service.syncNotesFromIndexToServer();
    expect(api.notes.create).toBeCalledTimes(1);
    expect(api.notes.update).toBeCalledTimes(0);
    const notes = await service.listNotesFromIndex();
    expect(notes).toHaveLength(3);
    expect(notes[0]).toHaveProperty("synced", true);
    expect(notes[1]).toHaveProperty("synced", true);
    expect(notes[2]).toHaveProperty("synced", true);
    expect(notes[0]).toHaveProperty("createOnServer", false);
    expect(notes[1]).toHaveProperty("createOnServer", false);
    expect(notes[2]).toHaveProperty("createOnServer", false);
  });

  it("Syncs an existing note with the server", async () => {
    const api = makeMockedApi([
      { ...defaultNote, noteId: "a" },
      { ...defaultNote, noteId: "b" }
    ]);
    const notesDbInterface = makeMockedNotesDbInterface([
      {
        ...defaultNote,
        noteId: "a",
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      },
      {
        ...defaultNote,
        noteId: "b",
        synced: false,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState,
        title: "Updated"
      }
    ]);
    const service = makeServiceWorkerApi(
      notesDbInterface as NotesDbInterface,
      api
    );
    await service.syncNotesFromIndexToServer();
    expect(api.notes.create).toBeCalledTimes(0);
    expect(api.notes.update).toBeCalledTimes(1);
    const notes = await service.listNotesFromIndex();
    expect(notes).toHaveLength(2);
    expect(notes[0]).toHaveProperty("synced", true);
    expect(notes[1]).toHaveProperty("synced", true);
    expect(notes[1]).toHaveProperty("createOnServer", false);
    expect(notes[1]).toHaveProperty("title", "Updated");
  });

  it("Syncs a deleted note with the server", async () => {
    const api = makeMockedApi([
      { ...defaultNote, noteId: "a" },
      { ...defaultNote, noteId: "b" }
    ]);
    const notesDbInterface = makeMockedNotesDbInterface([
      {
        ...defaultNote,
        noteId: "a",
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      },
      {
        ...defaultNote,
        noteId: "b",
        synced: false,
        createOnServer: false,
        state: "DELETE" as NoteIndexState
      }
    ]);
    const service = makeServiceWorkerApi(
      notesDbInterface as NotesDbInterface,
      api
    );
    await service.syncNotesFromIndexToServer();
    expect(api.notes.create).toBeCalledTimes(0);
    expect(api.notes.delete).toBeCalledTimes(1);
    const notes = await service.listNotesFromIndex();
    expect(notes).toHaveLength(1);
    expect(notes[0]).toHaveProperty("synced", true);
  });

  it("Syncs new notes from the server that have been created", async () => {
    const api = makeMockedApi([
      { ...defaultNote, noteId: "a" },
      { ...defaultNote, noteId: "b" },
      { ...defaultNote, noteId: "y" },
      { ...defaultNote, noteId: "z" }
    ]);
    const notesDbInterface = makeMockedNotesDbInterface([
      {
        ...defaultNote,
        noteId: "a",
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      },
      {
        ...defaultNote,
        noteId: "b",
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      }
    ]);
    const service = makeServiceWorkerApi(
      notesDbInterface as NotesDbInterface,
      api
    );
    await service.syncNotesFromIndexToServer();
    expect(api.notes.create).toBeCalledTimes(0);
    expect(api.notes.update).toBeCalledTimes(0);
    expect(api.notes.delete).toBeCalledTimes(0);
    const notes = await service.listNotesFromIndex();
    expect(notes).toHaveLength(4);
    expect(notes[0]).toHaveProperty("synced", true);
    expect(notes[1]).toHaveProperty("synced", true);
    expect(notes[2]).toHaveProperty("synced", true);
    expect(notes[3]).toHaveProperty("synced", true);
    expect(notes[0]).toHaveProperty("createOnServer", false);
    expect(notes[1]).toHaveProperty("createOnServer", false);
    expect(notes[2]).toHaveProperty("createOnServer", false);
    expect(notes[3]).toHaveProperty("createOnServer", false);
    expect(notes[2]).toHaveProperty("noteId", "y");
    expect(notes[3]).toHaveProperty("noteId", "z");
  });

  it("Syncs multiple operations with the server", async () => {
    const api = makeMockedApi([
      { ...defaultNote, noteId: "a" },
      { ...defaultNote, noteId: "b" },
      { ...defaultNote, noteId: "c" },
      { ...defaultNote, noteId: "y" },
      { ...defaultNote, noteId: "z" }
    ]);
    const notesDbInterface = makeMockedNotesDbInterface([
      {
        ...defaultNote,
        noteId: "a",
        synced: true,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState
      },
      {
        ...defaultNote,
        noteId: "b",
        synced: false,
        createOnServer: false,
        state: "DELETE" as NoteIndexState
      },
      {
        ...defaultNote,
        noteId: "c",
        synced: false,
        createOnServer: false,
        state: "UPDATE" as NoteIndexState,
        title: "Updated"
      },
      {
        ...defaultNote,
        noteId: "d",
        synced: false,
        createOnServer: true,
        state: "UPDATE" as NoteIndexState,
        title: "New"
      }
    ]);
    const service = makeServiceWorkerApi(
      notesDbInterface as NotesDbInterface,
      api
    );
    await service.syncNotesFromIndexToServer();
    expect(api.notes.create).toBeCalledTimes(1);
    expect(api.notes.update).toBeCalledTimes(1);
    expect(api.notes.delete).toBeCalledTimes(1);
    const notes = await service.listNotesFromIndex();
    expect(notes).toHaveLength(5);
    expect(notes[0]).toHaveProperty("synced", true);
    expect(notes[1]).toHaveProperty("synced", true);
    expect(notes[2]).toHaveProperty("synced", true);
    expect(notes[0]).toHaveProperty("createOnServer", false);
    expect(notes[1]).toHaveProperty("createOnServer", false);
    expect(notes[2]).toHaveProperty("createOnServer", false);
    expect(notes[0]).toHaveProperty("noteId", "a");
    expect(notes[1]).toHaveProperty("noteId", "c");
    expect(notes[2]).toHaveProperty("noteId", "y");
    expect(notes[3]).toHaveProperty("noteId", "z");
    // NB: note index 4 has been created with uuid on server so can't check it's value...
    expect(notes[1]).toHaveProperty("title", "Updated");
    expect(notes[4]).toHaveProperty("title", "New");
  });
});
