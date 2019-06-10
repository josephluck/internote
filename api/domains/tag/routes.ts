import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { TagEntity } from "./entity";
import { route } from "../router";
import { Option } from "space-lift";
import { UserEntity } from "../entities";

function makeController(deps: Dependencies) {
  const repo = deps.db.getRepository(TagEntity);

  return {
    async getAll(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      return user.fold(
        () => {
          ctx.body = deps.messages.throw(ctx, deps.messages.notFound("user"));
          return ctx;
        },
        async u => {
          ctx.body = await repo.find({ where: { user: u.id } });
          return ctx.body;
        }
      );
    }
  };
}

export function routes(deps: Dependencies) {
  return function(router: Router) {
    const controller = makeController(deps);

    router.get("/tags", deps.auth, route(deps, controller.getAll));

    return router;
  };
}

export default routes;
