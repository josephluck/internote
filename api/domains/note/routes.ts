import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { NoteEntity, createNote, updateNote } from "./entity";
import { route, RestController } from "../router";
import { dateIsGreaterThan } from "../../utilities/date";
import { Result, Option } from "space-lift";
import { validate, rules } from "../../dependencies/validation";
import { TagEntity, createTag } from "../tag/entity";

function makeDefaultNoteTags(note: NoteEntity) {
  return {
    ...note,
    tags: note.tags ? note.tags : []
  };
}

function makeController(deps: Dependencies): RestController {
  const notesRepo = deps.db.getRepository(NoteEntity);
  const tagsRepo = deps.db.getRepository(TagEntity);

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
            async ([updatedNote, params, u]) => {
              const existingNote = await notesRepo.findOne(params.noteId);
              const updateWillOverride = dateIsGreaterThan(
                existingNote.dateUpdated,
                updatedNote.previousDateUpdated
              );
              if (!updatedNote.overwrite && updateWillOverride) {
                return deps.messages.throw(
                  ctx,
                  deps.messages.overwrite("Note will be overwritten")
                );
              } else {
                // TODO: remove this when working
                await tagsRepo.remove(
                  await tagsRepo.find({ where: { user: u.id } })
                );
                const existingTags = await tagsRepo.find({
                  where: { user: u.id }
                });
                const existingTagWords = existingTags.map(t => t.tag);
                const newTags = updatedNote.tags
                  .filter(t => !existingTagWords.includes(t))
                  .map(tag => ({ tag }));
                const tagsToSave = newTags
                  .map(tag => createTag(tag, u))
                  .filter(t => t.isOk())
                  .map(t => t.get());
                const savedTags = await tagsRepo.save(tagsToSave);
                const allTags = await tagsRepo.find({ where: { user: u.id } });

                console.log({ newTags, allTags, savedTags });
                // TODO: remove old tags that are no longer used by any notes
                ctx.body = await notesRepo.save({
                  ...existingNote,
                  ...updatedNote,
                  tags: savedTags
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
