import { makeRouter } from "./router";
import { notesIndex, unmarshallNoteIndexToNote } from "./db";
import { makeApi } from "../api/api";
import { env } from "../env";
import {
  listNotes,
  updateNote,
  deleteNote,
  createNote,
  markNoteAsSynced as markNoteIndexAsSynced
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
      // TODO: delete note request now needs to know about the note
      await deleteNote(noteId, await event.request.json());
      return new Response(JSON.stringify({}));
    }
  });

  event.waitUntil(router.handle(event));
});

const syncNotes = async () => {
  const session = {} as any; // TODO: get session
  const allNotes = await notesIndex.notes.toArray();
  const notesToSync = allNotes.filter(note => !note.synced);
  await Promise.all(
    notesToSync.map(async note => {
      const update = unmarshallNoteIndexToNote(note);
      if (note.state === "CREATE") {
        await api.notes.create(session, {
          title: update.title,
          content: update.content,
          tags: update.tags
        });
      } else if (note.state === "UPDATE") {
        // TODO: the noteId might not work server-side if it's set by indexDB UUID.
        // figure out whether to do a create on the API to handle this, or fix it in
        // the IndexDB cache.
        await api.notes.update(session, note.noteId, {
          title: update.title,
          content: update.content,
          tags: update.tags
        });
      } else if (note.state === "DELETE") {
        await api.notes.delete(session, note.noteId);
      }
      await markNoteIndexAsSynced(note.noteId);
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
