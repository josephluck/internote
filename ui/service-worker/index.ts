import { makeRouter } from "./router";
import { unmarshallNoteIndexToNote, makeNotesDbInterface } from "./db";
import { makeServiceWorkerApi } from "./api";
import { makeApi } from "../api/api";
import { env } from "../env";

declare const self: ServiceWorkerGlobalScope;

const db = makeNotesDbInterface();
const serverApi = makeApi({
  host: env.SERVICES_HOST,
  region: env.SERVICES_REGION
});
const api = makeServiceWorkerApi(db, serverApi);

self.addEventListener("fetch", async event => {
  const router = makeRouter();

  router.add({
    path: "notes",
    method: "GET",
    handler: async event => {
      swLog("[HANDLER] Handling get notes request", { event });
      const notes = await api.listNotesFromIndex();
      return new Response(JSON.stringify(notes.map(unmarshallNoteIndexToNote)));
    }
  });

  router.add({
    path: "notes",
    method: "POST",
    handler: async event => {
      swLog("[HANDLER] Handling create note request", { event });
      const note = await api.createNewNoteInIndex(await event.request.json());
      return new Response(JSON.stringify(unmarshallNoteIndexToNote(note)));
    }
  });

  router.add({
    path: "notes/:noteId",
    method: "PUT",
    handler: async (event, { noteId }) => {
      swLog("[HANDLER] Handling update note request", { event, noteId });
      const note = await api.updateNoteInIndex(
        noteId,
        await event.request.json()
      );
      return new Response(JSON.stringify(unmarshallNoteIndexToNote(note)));
    }
  });

  router.add({
    path: "notes/:noteId",
    method: "DELETE",
    handler: async (event, { noteId }) => {
      swLog("[HANDLER] Handling delete note request", { event, noteId });
      await api.setNoteToDeletedInIndex(noteId);
      return new Response(JSON.stringify({}));
    }
  });

  event.waitUntil(router.handle(event));
});

self.addEventListener("sync", async event => {
  if (event.tag === "sync-notes") {
    swLog("[SYNC] starting sync");
    // TODO: debounce this!
    event.waitUntil(api.syncNotesFromIndexToServer());
  }
});

/**
 * Ensure the current page gets activated when service
 * worker gets activated.
 */
self.addEventListener("activate", () => self.clients.claim());

export const swLog = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);
