import { makeRouter } from "./router";
import { unmarshallNoteIndexToNote } from "./db";
import { makeApi } from "../api/api";
import { env } from "../env";
import {
  listNotes,
  updateNoteInIndex,
  deleteNoteInIndex,
  createNote,
  removeNoteFromIndex,
  getNotesToSync,
  replaceNoteInIndexWithServerNote
} from "./api";

// TODO: env might need to be done through webpack at build time?
const api = makeApi({
  host: env.SERVICES_HOST,
  region: env.SERVICES_REGION
});

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("fetch", async event => {
  const router = makeRouter();

  router.add({
    path: "notes",
    method: "GET",
    handler: async event => {
      swLog("[HANDLER] Handling get notes request", { event });
      const notes = await listNotes();
      return new Response(JSON.stringify(notes.map(unmarshallNoteIndexToNote)));
    }
  });

  router.add({
    path: "notes",
    method: "POST",
    handler: async event => {
      swLog("[HANDLER] Handling create note request", { event });
      const note = await createNote(await event.request.json());
      return new Response(JSON.stringify(unmarshallNoteIndexToNote(note)));
    }
  });

  router.add({
    path: "notes/:noteId",
    method: "PUT",
    handler: async (event, { noteId }) => {
      swLog("[HANDLER] Handling update note request", { event, noteId });
      const note = await updateNoteInIndex(noteId, await event.request.json());
      return new Response(JSON.stringify(unmarshallNoteIndexToNote(note)));
    }
  });

  router.add({
    path: "notes/:noteId",
    method: "DELETE",
    handler: async (event, { noteId }) => {
      swLog("[HANDLER] Handling delete note request", { event, noteId });
      await deleteNoteInIndex(noteId);
      return new Response(JSON.stringify({}));
    }
  });

  event.waitUntil(router.handle(event));
});

const syncNotes = async () => {
  const session = {} as any; // TODO: get session from IndexDB

  const noteIndexesToCreate = await getNotesToSync(
    note => note.createOnServer && note.state !== "DELETE"
  );
  await Promise.all(
    noteIndexesToCreate.map(async noteIndex => {
      swLog(`[SYNC] creating note ${noteIndex.title}`);
      const update = unmarshallNoteIndexToNote(noteIndex);
      const result = await api.notes.create(session, {
        title: update.title,
        content: update.content,
        tags: update.tags
      });
      return await result.fold(
        () => Promise.resolve(),
        async serverNote =>
          await replaceNoteInIndexWithServerNote(noteIndex.noteId, serverNote)
      );
    })
  );

  const noteIndexesToUpdate = await getNotesToSync(
    note => !note.createOnServer && note.state === "UPDATE"
  );
  await Promise.all(
    noteIndexesToUpdate.map(async noteIndex => {
      swLog(`[SYNC] updating note ${noteIndex.title}`);
      const update = unmarshallNoteIndexToNote(noteIndex);
      const result = await api.notes.update(session, update.noteId, {
        title: update.title,
        content: update.content,
        tags: update.tags
      });
      return result.fold(
        () => Promise.resolve(),
        async serverNote =>
          await replaceNoteInIndexWithServerNote(noteIndex.noteId, serverNote)
      );
    })
  );

  const noteIndexesToDelete = await getNotesToSync(
    note => !note.createOnServer && note.state === "DELETE"
  );
  await Promise.all(
    noteIndexesToDelete.map(async noteIndex => {
      swLog(`[SYNC] deleting note ${noteIndex.title}`);
      await api.notes.delete(session, noteIndex.noteId);
      await removeNoteFromIndex(noteIndex.noteId);
    })
  );
};

self.addEventListener("sync", async event => {
  if (event.tag === "sync-notes") {
    swLog("[SYNC] starting sync");
    event.waitUntil(syncNotes());
  }
});

/**
 * Ensure the current page gets activated when service
 * worker gets activated.
 */
self.addEventListener("activate", () => self.clients.claim());

// TODO: All files must be modules when the '--isolatedModules' flag is provided.
export const foo = null;

const swLog = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);
