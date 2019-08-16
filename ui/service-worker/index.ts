import { makeRouter } from "./router";
import { notesIndex } from "./db";
import { makeApi } from "../api/api";
import { env } from "../env";
import { listNotes, updateNote, deleteNote, createNote } from "./api";

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
      log("Handling get notes request", { event });
      const notes = await listNotes();
      return new Response(JSON.stringify(notes));
    }
  });

  router.add({
    path: "notes",
    method: "POST",
    handler: async event => {
      log("Handling create note request", { event });
      const note = await createNote(await event.request.json());
      return new Response(JSON.stringify(note));
    }
  });

  router.add({
    path: "notes/:noteId",
    method: "PUT",
    handler: async (event, { noteId }) => {
      log("Handling update note request", { event, noteId });
      const note = await updateNote(noteId, await event.request.json());
      return new Response(JSON.stringify(note));
    }
  });

  router.add({
    path: "notes/:noteId",
    method: "DELETE",
    handler: async (event, { noteId }) => {
      log("Handling delete note request", { event, noteId });
      await deleteNote(noteId);
      return new Response(JSON.stringify({}));
    }
  });

  event.waitUntil(router.handle(event));
});

const syncNotes = async () => {
  const allNotes = await notesIndex.notes.toArray();
  const notesToSync = allNotes.filter(note => !note.synced);
  await Promise.all(
    notesToSync.map(note => {
      // TODO: make request here
      api.notes.update();
    })
  );
};

self.addEventListener("sync", async event => {
  if (event.tag === "sync-notes") {
    event.waitUntil(syncNotes());
  }
});

self.addEventListener("activate", () => self.clients.claim());

// TODO: All files must be modules when the '--isolatedModules' flag is provided.
export const foo = null;

const log = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);
