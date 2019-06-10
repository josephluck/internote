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

  async function createTagsIfNeeded(
    tagsToCreate: string[],
    note: NoteEntity,
    user: UserEntity
  ): Promise<TagEntity[]> {
    // TODO: remove delete when tag auto deletion working fully
    await tagsRepo.remove(await tagsRepo.find({ where: { user: user.id } }));
    const existingTags = await tagsRepo.find({
      where: { user: user.id }
    });
    const existingTagWords = existingTags.map(t => t.tag);
    const newTags = tagsToCreate
      .filter(t => !existingTagWords.includes(t))
      .map(tag => ({ tag }));
    const tagsToSave = newTags
      .map(tag => createTag(tag, user))
      .filter(t => t.isOk())
      .map(t => t.get());
    await tagsRepo.save(tagsToSave);
    // TODO: make this more performant by also querying on note
    const allTags = await tagsRepo.find({ where: { user: user.id } });
    return allTags.filter(t => t.notes.map(n => n.id).includes(note.id));
  }

  return {
    findAll: (ctx, user) =>
      user
        .map(async u => {
          const notes = await notesRepo.find({
            where: { user: u.id }
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
                const tags = await createTagsIfNeeded(
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
