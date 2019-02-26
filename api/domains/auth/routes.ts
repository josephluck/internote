import * as Router from "koa-router";
import { Dependencies } from "../../app";
import { UserEntity, createUser } from "../user/entity";
import { Option } from "space-lift";
import * as crypt from "bcryptjs";
import { route } from "../router";
import {
  PreferencesEntity,
  makeDefaultPreferences
} from "../preferences/entity";

function makeController(deps: Dependencies) {
  const repo = deps.db.getRepository(UserEntity);
  const preferencesRepo = deps.db.getRepository(PreferencesEntity);

  return {
    async login(ctx: Router.IRouterContext) {
      return Option(
        await repo.findOne({
          email: ctx.request.body["email"]
        })
      ).fold(
        () => {
          deps.messages.throw(
            ctx,
            deps.messages.badRequest("Incorrect username")
          );
        },
        async user => {
          const passwordOkay = await crypt.compare(
            ctx.request.body["password"],
            user.password
          );
          if (passwordOkay) {
            // TODO: this includes the users hashed password in the response
            ctx.body = {
              user,
              token: deps.jwt.sign(user.id.toString(), process.env.JWT_SECRET!)
            };
          } else {
            deps.messages.throw(
              ctx,
              deps.messages.badRequest("Incorrect password")
            );
          }
        }
      );
    },
    async register(ctx: Router.IRouterContext) {
      const opt = await createUser(ctx.request.body as any);
      return opt.fold(
        () => {
          return deps.messages.throw(
            ctx,
            deps.messages.badRequest("Bad request")
          );
        },
        async u => {
          const user = await repo.save(await u);
          await preferencesRepo.save(makeDefaultPreferences(user));

          // TODO: this includes the users hashed password in the response
          ctx.body = {
            user: await repo.find({ where: { id: user.id } }),
            token: deps.jwt.sign(user.id.toString(), process.env.JWT_SECRET!)
          };
          return ctx.body;
        }
      );
    },
    async getSession(ctx: Router.IRouterContext, user: Option<UserEntity>) {
      return user.fold(
        () => {
          deps.messages.throw(ctx, deps.messages.notFound("user"));
        },
        user => {
          // TODO: this includes the users hashed password in the response
          ctx.body = {
            user,
            token: deps.jwt.sign(user.id.toString(), process.env.JWT_SECRET!)
          };
          return ctx.body;
        }
      );
    }
  };
}

export function routes(deps: Dependencies) {
  return function(router: Router) {
    const controller = makeController(deps);

    router.post("/login", route(deps, controller.login));
    router.get("/session", deps.auth, route(deps, controller.getSession));
    router.post("/register", route(deps, controller.register));

    return router;
  };
}

export default routes;
