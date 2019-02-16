import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { UserEntity } from "./entity";
import { route } from "../router";
import { Option } from "space-lift";

function makeController(deps: Dependencies) {
  const repo = deps.db.getRepository(UserEntity);

  return {
    async getAll(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      return user.fold(
        () => {
          return deps.messages.throw(ctx, deps.messages.notFound("user"));
        },
        async u => {
          ctx.body = await repo.find({
            where: { id: u.id }
          });
          return ctx.body;
        }
      );
    },
    async getById(ctx: Router.IRouterContext) {
      ctx.body = await repo.findOne(ctx.params.userId);
      return ctx.body;
    },
    async deleteById(ctx: Router.IRouterContext) {
      await repo.delete(ctx.params.userId);
      return (ctx.body = {});
    },
    async updatePreferences(
      ctx: Router.IRouterContext,
      user: Option<UserEntity>
    ) {
      return user.fold(
        () => {
          return deps.messages.throw(ctx, deps.messages.notFound("user"));
        },
        async u => {
          console.log({ user: u }, { preferences: ctx.request.body });
          await repo.update(u.id, {
            preferences: ctx.request.body
          });
          ctx.body = await repo.find({
            where: { id: u.id }
          });
          return ctx.body;
        }
      );
    }
  };
}

export function routes(deps: Dependencies) {
  return function(router: Router) {
    const controller = makeController(deps);

    router.get("/users", deps.auth, route(deps, controller.getAll));
    router.get("/users/:userId", deps.auth, route(deps, controller.getById));
    router.delete(
      "/users/:userId",
      deps.auth,
      route(deps, controller.deleteById)
    );
    router.put(
      "/users/:userId/preferences",
      deps.auth,
      route(deps, controller.updatePreferences)
    );

    return router;
  };
}

export default routes;
