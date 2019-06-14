import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { NoteEntity, createNote, updateNote } from "./entity";
import { route, RestController } from "../router";
import { dateIsGreaterThan } from "../../utilities/date";
import { Result, Option } from "space-lift";
import { validate, rules } from "../../dependencies/validation";
import { TagEntity, createTag } from "../tag/entity";
import { UserEntity } from "../entities";
import { dedupeArray } from "../../utilities/general";

function makeDefaultNoteTags(note: NoteEntity) {
  return {
    ...note,
    tags: note.tags ? note.tags : []
  };
}

function makeController(deps: Dependencies): RestController {
  const notesRepo = deps.db.getRepository(NoteEntity);
  const tagsRepo = deps.db.getRepository(TagEntity);

  // TODO: move this to GET /tags?
  async function removeOrphanedTags(user: UserEntity) {
    const tags = await tagsRepo.find({
      where: { user: user.id },
      relations: ["notes"]
    });
    const orphanedTags = tags.filter(t => !t.notes || t.notes.length === 0);
    console.log("Removing orphans", JSON.stringify(orphanedTags));
    await tagsRepo.remove(orphanedTags);
  }

  // Create any tags that are new
  // Add note relationship to any existing tags
  // Remove note relationship for any tags that have note relationship that are no longer present
  // Delete any tags that no longer have any notes
  // TODO: could do all create & update operations in a single db transaction
  async function createOrUpdateTagsForNote(
    tagsStrs: string[],
    note: NoteEntity,
    user: UserEntity
  ): Promise<TagEntity[]> {
    const existingTags = await tagsRepo.find({
      where: { user: user.id },
      relations: ["notes"]
    });

    // Remove note relationship with any tags that have been removed from note
    const tagEntitiesToRemoveNoteRelationship = existingTags
      .filter(t => !tagsStrs.includes(t.tag))
      .map(t => ({
        ...t,
        notes: t.notes ? t.notes.filter(n => n.id !== note.id) : []
      }));

    // Update existing tags with note relationship
    const tagEntitiesToCreateNoteRelationship = existingTags
      .filter(t => tagsStrs.includes(t.tag))
      .map(t => ({
        ...t,
        notes: t.notes ? [...t.notes, note] : [note]
      }));

    // Create new tags and add relationship to note
    const existingTagsStrs = existingTags.map(t => t.tag);
    const tagsStrsToCreate: string[] = dedupeArray(tagsStrs)
      .filter(t => !!t && t.length > 0)
      .filter(t => !existingTagsStrs.includes(t));
    const tagEntitiesToCreate: TagEntity[] = tagsStrsToCreate
      .map(t => createTag({ tag: t }, user))
      .filter(t => t.isOk())
      .map(t => t.toOption().get())
      .map(t => ({ ...t, notes: [note] }));

    await tagsRepo.save([
      ...tagEntitiesToRemoveNoteRelationship,
      ...tagEntitiesToCreateNoteRelationship,
      ...tagEntitiesToCreate
    ]);

    // Remove any tags that no longer have any note relationships
    await removeOrphanedTags(user);

    // Respond with latest tags
    const latestNote = await notesRepo.findOne(note.id, {
      relations: ["tags"]
    });
    return latestNote.tags;
  }

  return {
    findAll: (ctx, user) =>
      user
        .map(async u => {
          const notes = await notesRepo.find({
            where: { user: u.id },
            relations: ["tags"]
          });
          ctx.body = notes.map(makeDefaultNoteTags);
          return ctx.body;
        })
        .get(),
    findById: (ctx, user) =>
      Option.all([
        user,
        validate<{ noteId: string }>(ctx.params, {
          noteId: [rules.required]
        }).toOption()
      ]).fold(
        async () =>
          deps.messages.throw(
            ctx,
            deps.messages.badRequest("Missing required parameter noteId")
          ),
        async ([u, params]) => {
          const note = await notesRepo.findOne({
            where: {
              user: u.id,
              id: params.noteId
            }
          });
          ctx.body = makeDefaultNoteTags(note);
          return ctx.body;
        }
      ),
    create: (ctx, user) =>
      user
        .map(u =>
          createNote(ctx.request.body, u).fold(
            async () =>
              deps.messages.throw(ctx, deps.messages.badRequest("Notes")),
            async newNote => {
              const note = await notesRepo.save(newNote);
              ctx.body = makeDefaultNoteTags(note);
              return ctx.body;
            }
          )
        )
        .get(),
    updateById: (ctx, user) =>
      user
        .map(u =>
          Result.all([
            updateNote(ctx.request.body, u),
            validate(ctx.params, { noteId: [rules.required] }),
            user.toResult(() => null)
          ]).fold(
            async () =>
              deps.messages.throw(ctx, deps.messages.badRequest("Notes")),
            async ([updates, params, u]) => {
              const existingNote = await notesRepo.findOne(params.noteId);
              const updateWillOverride = dateIsGreaterThan(
                existingNote.dateUpdated,
                updates.previousDateUpdated
              );
              if (!updates.overwrite && updateWillOverride) {
                return deps.messages.throw(
                  ctx,
                  deps.messages.overwrite("Note will be overwritten")
                );
              } else {
                const tags = await createOrUpdateTagsForNote(
                  updates.tags,
                  existingNote,
                  u
                );
                const { title, content } = updates;
                const updatedNote = await notesRepo.save({
                  ...existingNote,
                  title,
                  content,
                  tags
                });
                ctx.body = { ...updatedNote, tags };
                return ctx.body;
              }
            }
          )
        )
        .get(),
    deleteById: async ctx => {
      await notesRepo.delete(ctx.params.noteId);
      ctx.body = {};
      return ctx.body;
    }
  };
}

export function routes(deps: Dependencies) {
  return function(router: Router) {
    const controller = makeController(deps);
    router.get("/notes", deps.auth, route(deps, controller.findAll));
    router.get("/notes/:noteId", deps.auth, route(deps, controller.findById));
    router.post("/notes", deps.auth, route(deps, controller.create));
    router.put("/notes/:noteId", deps.auth, route(deps, controller.updateById));
    router.delete(
      "/notes/:noteId",
      deps.auth,
      route(deps, controller.deleteById)
    );

    return router;
  };
}

export default routes;
