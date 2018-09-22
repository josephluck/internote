import * as Router from "koa-router";
import { Dependencies } from "../../";
import { NoteEntity, createNote } from "./entity";
import { route } from "../../router";
import { Option } from "space-lift";
import { UserEntity } from "../user/entity";

type Controller = Record<
  string,
  (ctx: Router.IRouterContext, user: Option<UserEntity>) => Promise<any>
>;

function makeController(deps: Dependencies): Controller {
  const repo = deps.db.getRepository(NoteEntity);

  return {
    async getAll(ctx, user) {
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
    async getById(ctx) {
      ctx.body = await repo.findOne(ctx.params.noteId);
      return ctx.body;
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

    router.get("/notes", deps.auth, route(deps, controller.getAll));
    router.get("/notes/:noteId", deps.auth, route(deps, controller.getById));
    router.delete(
      "/notes/:noteId",
      deps.auth,
      route(deps, controller.deleteById)
    );

    return router;
  };
}

export default routes;
