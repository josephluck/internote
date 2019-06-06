import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { NoteEntity, createNote, updateNote } from "./entity";
import { route, RestController } from "../router";
import { dateIsEqualOrGreaterThan } from "../../utilities/date";
import { Result } from "space-lift";
import { validate, rules } from "../../dependencies/validation";

function makeController(deps: Dependencies): RestController {
  const repo = deps.db.getRepository(NoteEntity);

  return {
    findAll: async (_ctx, user) =>
      user.map(
        async u =>
          await repo.find({
            where: { user: u.id }
          })
      ),
    findById: async (ctx, user) =>
      Result.all([
        user.toResult(() => null),
        validate<{ noteId: string }>(ctx.params, { noteId: [rules.required] })
      ]).fold(
        () =>
          deps.messages.throw(
            ctx,
            deps.messages.badRequest("Missing required parameter noteId")
          ),
        async ([u, params]) =>
          await repo.findOne({
            where: {
              user: u.id,
              id: params.noteId
            }
          })
      ),
    create: async (ctx, user) =>
      user.map(u =>
        createNote(ctx.request.body, u).fold(
          () => deps.messages.throw(ctx, deps.messages.badRequest("Notes")),
          async note => await repo.save(note)
        )
      ),
    updateById: async (ctx, user) =>
      user.map(u =>
        Result.all([
          updateNote(ctx.request.body, u),
          validate(ctx.params, { noteId: [rules.required] })
        ]).fold(
          () => deps.messages.throw(ctx, deps.messages.badRequest("Notes")),
          async ([newNote, params]) => {
            const existingNote = await repo.findOne(params.noteId);
            const updateWillOverride = dateIsEqualOrGreaterThan(
              existingNote.dateUpdated,
              newNote.previousDateUpdated
            );
            if (updateWillOverride) {
              deps.messages.throw(
                ctx,
                deps.messages.overwrite("Note will be overwritten")
              );
            } else {
              ctx.body = await repo.save({ ...existingNote, ...newNote });
              return ctx.body;
            }
          }
        )
      ),
    deleteById: async ctx => {
      await repo.delete(ctx.params.noteId);
      ctx.body = {};
      return ctx.body;
    }
  };
}

export function routes(deps: Dependencies) {
  return function(router: Router) {
    const controller = makeController(deps);
    router.get(
      "/notes",
      deps.auth,
      route(deps, controller.findAll, { auth: true })
    );
    router.get(
      "/notes/:noteId",
      deps.auth,
      route(deps, controller.findById, { auth: true })
    );
    router.post(
      "/notes",
      deps.auth,
      route(deps, controller.create, { auth: true })
    );
    router.put(
      "/notes/:noteId",
      deps.auth,
      route(deps, controller.updateById, { auth: true })
    );
    router.delete(
      "/notes/:noteId",
      deps.auth,
      route(deps, controller.deleteById, { auth: true })
    );

    return router;
  };
}

export default routes;
