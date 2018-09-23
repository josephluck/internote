import * as Router from "koa-router";
import { Dependencies } from "../../";
import { NoteEntity, createNote } from "./entity";
import { route, RestController } from "../../router";

function makeController(deps: Dependencies): RestController {
  const repo = deps.db.getRepository(NoteEntity);

  return {
    async findAll(ctx, user) {
      return user.fold(
        () => {
          return deps.messages.throw(ctx, deps.messages.notFound("notes"));
        },
        async u => {
          ctx.body = await repo.find({
            where: { user: u.id }
          });
          return ctx.body;
        }
      );
    },
    async findById(ctx, user) {
      return user.fold(
        () => {
          return deps.messages.throw(ctx, deps.messages.notFound("notes"));
        },
        async () => {
          // TODO: ensure that the findOne only fetches
          // note that belongs to current logged in user
          ctx.body = await repo.findOne(ctx.params.noteId);
          return ctx.body;
        }
      );
    },
    async create(ctx, user) {
      return user.fold(
        () => {
          return deps.messages.throw(ctx, deps.messages.badRequest("No user"));
        },
        async u => {
          return createNote(ctx.request.body, u).fold(
            () => {
              ctx.body = deps.messages.throw(
                ctx,
                deps.messages.badRequest("Notes")
              );
              return ctx;
            },
            async note => {
              const n = await repo.save(note);
              ctx.body = await repo.findOne(n.id);
              return ctx.body;
            }
          );
        }
      );
    },
    async updateById(ctx, user) {
      return user.fold(
        () => {
          return deps.messages.throw(ctx, deps.messages.badRequest("No user"));
        },
        async u => {
          return createNote(ctx.request.body, u).fold(
            () => {
              ctx.body = deps.messages.throw(
                ctx,
                deps.messages.badRequest("Notes")
              );
              return ctx;
            },
            async note => {
              const existingNote = await repo.findOne(ctx.params.noteId);
              ctx.body = await repo.save({ ...existingNote, ...note });
              return ctx.body;
            }
          );
        }
      );
    },
    async deleteById(ctx) {
      await repo.delete(ctx.params.noteId);
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
