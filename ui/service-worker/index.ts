import { makeRouter } from "./router";
import { notesDb } from "./db";
import { UpdateNoteDTO } from "@internote/notes-service/types";

declare const self: ServiceWorkerGlobalScope;

const log = (msg: string, ...args: any[]) =>
  console.log(`[SW] ${msg}`, ...args);

const addOrUpdateNote = async (noteId: string, body: UpdateNoteDTO) => {
  const note = await notesDb.notes.get(noteId);
  const updates = {
    noteId: body.noteId,
    userId: body.userId,
    title: body.title,
    content: body.content,
    tags: [...new Set(body.tags)]
  };
  if (note) {
    await notesDb.notes.update(noteId, {
      ...note,
      ...updates,
      dateUpdated: Date.now()
    });
  } else {
    await notesDb.notes.add({ ...updates, dateCreated: Date.now() });
  }
  return await notesDb.notes.get(noteId);
};

self.addEventListener("fetch", async event => {
  const router = makeRouter();

  router.add({
    path: "notes/:noteId",
    method: "PUT",
    handler: async (event, { noteId }) => {
      log("Handling update note request", { event, noteId });
      const note = await addOrUpdateNote(noteId, await event.request.json());
      return new Response(JSON.stringify(note));
    }
  });

  event.waitUntil(router.handle(event));
});

self.addEventListener("activate", () => self.clients.claim());

// TODO: All files must be modules when the '--isolatedModules' flag is provided.
export const foo = null;
