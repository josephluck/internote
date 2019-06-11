import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { NoteEntity, createNote, updateNote } from "./entity";
import { route, RestController } from "../router";
import { dateIsGreaterThan } from "../../utilities/date";
import { Result, Option } from "space-lift";
import { validate, rules } from "../../dependencies/validation";
import { TagEntity, createTag } from "../tag/entity";
import { UserEntity } from "../entities";

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
    const latestTags = await tagsRepo.find({ where: { user: user.id } });
    await tagsRepo.remove(
      latestTags.filter(t => !t.notes || t.notes.length === 0)
    );
  }

  // Create any tags that are new
  // Add note relationship to any existing tags
  // Remove note relationship for any tags that have note relationship that are no longer present
  // Delete any tags that no longer have any notes
  async function createOrUpdateTagsForNote(
    tagsStrs: string[],
    note: NoteEntity,
    user: UserEntity
  ): Promise<TagEntity[]> {
    const existingTags = await tagsRepo.find({
      where: { user: user.id }
    });
    const existingTagsStrs = existingTags.map(t => t.tag);

    // Create tags that are new and add relationship to note
    const tagsStrsToCreate = tagsStrs
      .filter(t => !!t && t.length > 0)
      .filter(t => !existingTagsStrs.includes(t));
    const tagEntitiesToCreate = [...new Set(tagsStrsToCreate)] // NB: dedupe tags
      .map(t => createTag({ tag: t }, user))
      .filter(t => t.isOk())
      .map(t => t.toOption().get())
      .map(t => ({ ...t, notes: [note] }));
    await tagsRepo.save(tagEntitiesToCreate);

    // Update any existing tags with note relationship
    const tagEntitiesToUpdate = existingTags.filter(t =>
      tagsStrs.includes(t.tag)
    );
    await tagsRepo.save(
      tagEntitiesToUpdate.map(t => ({
        ...t,
        notes: t.notes ? [...t.notes, note] : [note]
      }))
    );

    // Remove note relationship with any tags that are no longer present in note
    const tagEntitiesToRemoveNoteRelationship = existingTags.filter(
      t => !tagsStrs.includes(t.tag)
    );
    await tagsRepo.save(
      tagEntitiesToRemoveNoteRelationship.map(t => ({
        ...t,
        notes: t.notes ? t.notes.filter(n => n.id !== note.id) : []
      }))
    );

    // Remove any tags that no longer have notes
    await removeOrphanedTags(user);

    // Respond with final tags
    const finalNote = await notesRepo.findOne({
      relations: ["tags"],
      where: { id: note.id, user: user.id }
    });
    return finalNote.tags;
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
                // TODO: remove old tags that are no longer used by any notes
                ctx.body = await notesRepo.save({
                  ...existingNote,
                  ...updates,
                  tags
                });
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
