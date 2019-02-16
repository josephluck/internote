import * as Router from "koa-router";
import { Dependencies } from "../../app";
import {
  PreferencesEntity,
  createPreferences,
  makeDefaultPreferences
} from "./entity";
import { route } from "../router";
import { Option } from "space-lift";
import { UserEntity } from "../entities";

function makeController(deps: Dependencies) {
  const repo = deps.db.getRepository(PreferencesEntity);

  async function getOrCreatePreferences(user: UserEntity) {
    const preferences = await repo.findOne({ where: { user: user.id } });
    return preferences
      ? preferences
      : await repo
          .save(makeDefaultPreferences(user))
          .then(() => repo.findOne({ where: { user: user.id } }));
  }

  return {
    async get(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      return user.fold(
        () => {
          ctx.body = deps.messages.throw(ctx, deps.messages.notFound("user"));
          return ctx;
        },
        async u => {
          ctx.body = await getOrCreatePreferences(u);
          return ctx.body;
        }
      );
    },
    async update(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      return user.fold(
        () => {
          return deps.messages.throw(ctx, deps.messages.notFound("user"));
        },
        async u => {
          return createPreferences(ctx.request.body, u).fold(
            () => {
              ctx.body = deps.messages.throw(
                ctx,
                deps.messages.badRequest("Preferences")
              );
              return ctx;
            },
            async preferences => {
              const existingPreferences = await getOrCreatePreferences(u);
              ctx.body = await repo.save({
                ...existingPreferences,
                ...preferences
              });
              return ctx.body;
            }
          );
        }
      );
    }
  };
}

export function routes(deps: Dependencies) {
  return function(router: Router) {
    const controller = makeController(deps);

    router.get("/preferences", deps.auth, route(deps, controller.get));
    router.put("/preferences", deps.auth, route(deps, controller.update));

    return router;
  };
}

export default routes;
