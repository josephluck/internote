import { makeServiceWorkerApi } from "./api";
import { NotesDbInterface, NoteIndex } from "./db";
import { defaultNote } from "@internote/notes-service/db/default-note";

describe("SW / api", () => {
  it("Lists notes in index", async () => {
    const db = {
      getAll() {
        return Promise.resolve([
          { ...defaultNote, noteId: "a" },
          { ...defaultNote, noteId: "b" }
        ]);
      }
    } as Partial<NotesDbInterface>;
    const api = {} as any;
    const service = makeServiceWorkerApi(db as NotesDbInterface, api);
    const notes = await service.listNotesFromIndex();
    expect(notes).toHaveLength(2);
    expect(notes[0]).toHaveProperty("noteId", "a");
    expect(notes[1]).toHaveProperty("noteId", "b");
  });

  it("Creates a new note in the index", async () => {
    const db = (() => {
      let notes = {
        a: { ...defaultNote, noteId: "a" },
        b: { ...defaultNote, noteId: "b" }
      };
      return {
        add(body: NoteIndex) {
          notes[body.noteId] = body;
          return Promise.resolve(body.noteId);
        },
        getAll() {
          return Promise.resolve(Object.values(notes));
        },
        get(id: string) {
          return Promise.resolve(notes[id]);
        }
      };
    })() as Partial<NotesDbInterface>;
    const api = {} as any;
    const service = makeServiceWorkerApi(db as NotesDbInterface, api);
    const note = await service.createNewNoteInIndex({
      ...defaultNote,
      noteId: "c",
      title: "Internote"
    });
    const notes = await service.listNotesFromIndex();
    expect(note).toHaveProperty("noteId", "c");
    expect(note).toHaveProperty("title", "Internote");
    expect(note).toHaveProperty("state", "UPDATE");
    expect(notes).toHaveLength(3);
  });

  it("Updates an existing note in the index", async () => {
    const db = (() => {
      let notes = {
        a: { ...defaultNote, noteId: "a" },
        b: { ...defaultNote, noteId: "b", synced: true } // NB: simulate updating a note that has already been synced on the server
      };
      return {
        update(id: string, body: NoteIndex) {
          notes[id] = { ...notes[id], ...body };
          return Promise.resolve(1);
        },
        getAll() {
          return Promise.resolve(Object.values(notes));
        },
        get(id: string) {
          return Promise.resolve(notes[id]);
        }
      };
    })() as Partial<NotesDbInterface>;
    const api = {} as any;
    const service = makeServiceWorkerApi(db as NotesDbInterface, api);
    const note = await service.updateNoteInIndex("b", {
      noteId: "b",
      title: "Updated title"
    } as any);
    const notes = await service.listNotesFromIndex();
    expect(note).toHaveProperty("noteId", "b");
    expect(note).toHaveProperty("title", "Updated title");
    expect(note).toHaveProperty("synced", false);
    expect(note).toHaveProperty("createOnServer", false);
    expect(note).toHaveProperty("state", "UPDATE");
    expect(notes).toHaveLength(2);
  });

  it("Creates a note in the index (and sets to pending create on server) when updating a note not already in there", async () => {
    const db = (() => {
      let notes = {
        a: { ...defaultNote, noteId: "a" },
        b: { ...defaultNote, noteId: "b" }
      };
      return {
        add(body: NoteIndex) {
          notes[body.noteId] = body;
          return Promise.resolve(body.noteId);
        },
        update(id: string, body: NoteIndex) {
          notes[id] = { ...notes[id], ...body };
          return Promise.resolve(1);
        },
        getAll() {
          return Promise.resolve(Object.values(notes));
        },
        get(id: string) {
          return Promise.resolve(notes[id]);
        }
      };
    })() as Partial<NotesDbInterface>;
    const api = {} as any;
    const service = makeServiceWorkerApi(db as NotesDbInterface, api);
    const note = await service.updateNoteInIndex("c", {
      noteId: "c",
      title: "Updated title"
    } as any);
    const notes = await service.listNotesFromIndex();
    expect(note).toHaveProperty("noteId", "c");
    expect(note).toHaveProperty("title", "Updated title");
    expect(note).toHaveProperty("synced", false);
    expect(note).toHaveProperty("createOnServer", true);
    expect(note).toHaveProperty("state", "UPDATE");
    expect(notes).toHaveLength(3);
  });

  it("Marks a note as deleted in the index", async () => {
    const db = (() => {
      let notes = {
        a: { ...defaultNote, noteId: "a" },
        b: { ...defaultNote, noteId: "b" }
      };
      return {
        update(id: string, body: NoteIndex) {
          notes[id] = { ...notes[id], ...body };
          return Promise.resolve(1);
        },
        getAll() {
          return Promise.resolve(Object.values(notes));
        },
        get(id: string) {
          return Promise.resolve(notes[id]);
        }
      };
    })() as Partial<NotesDbInterface>;
    const api = {} as any;
    const service = makeServiceWorkerApi(db as NotesDbInterface, api);
    const note = await service.setNoteToDeletedInIndex("b");
    const notes = await service.listNotesFromIndex();
    expect(note).toHaveProperty("noteId", "b");
    expect(note).toHaveProperty("state", "DELETE");
    expect(note).toHaveProperty("createOnServer", false);
    expect(note).toHaveProperty("synced", false);
    expect(notes).toHaveLength(2);
  });
});
