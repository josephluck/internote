import { makeRouter } from "./router";
import { unmarshallNoteIndexToNote } from "./db";
import {
  listNotes,
  updateNoteInIndex,
  setNoteToDeletedInIndex,
  createNewNoteInIndex,
  syncNotesToServer
} from "./api";

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
      const note = await createNewNoteInIndex(await event.request.json());
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
      await setNoteToDeletedInIndex(noteId);
      return new Response(JSON.stringify({}));
    }
  });

  event.waitUntil(router.handle(event));
});

self.addEventListener("sync", async event => {
  if (event.tag === "sync-notes") {
    swLog("[SYNC] starting sync");
    // TODO: debounce this!
    event.waitUntil(syncNotesToServer());
  }
});

/**
 * Ensure the current page gets activated when service
 * worker gets activated.
 */
self.addEventListener("activate", () => self.clients.claim());

export const swLog = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);
