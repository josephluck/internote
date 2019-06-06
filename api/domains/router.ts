import * as Router from "koa-router";
import { compose } from "ramda";
import { Option } from "space-lift";
import { Dependencies } from "../app";
import user from "./user/routes";
import auth from "./auth/routes";
import note from "./note/routes";
import preferences from "./preferences/routes";
import speech from "./speech/routes";
import dictionary from "./dictionary/routes";
import { UserEntity } from "./user/entity";

type ControllerFn = (
  ctx: Router.IRouterContext,
  user: Option<UserEntity>
) => Promise<any>;

export interface RestController {
  findAll: ControllerFn;
  findById: ControllerFn;
  create: ControllerFn;
  updateById: ControllerFn;
  deleteById: ControllerFn;
  [key: string]: ControllerFn;
}

export type Controller = Record<string, ControllerFn>;

export function route(
  deps: Dependencies,
  cb: ControllerFn,
  options: { auth?: boolean } = {}
) {
  const { auth = false } = options;
  return async function(ctx: Router.IRouterContext, next: () => Promise<any>) {
    const user = Option(
      await deps.db.manager.findOne(UserEntity, ctx.state.user)
    );

    async function respond() {
      await cb(ctx, user);
      next();
    }

    user.fold(
      () => {
        if (auth) {
          deps.messages.throw(ctx, deps.messages.notFound("User"));
          next();
        } else {
          respond();
        }
      },
      () => respond()
    );
  };
}

export default function routes(deps: Dependencies) {
  const rts = compose(
    user(deps),
    auth(deps),
    note(deps),
    preferences(deps),
    speech(deps),
    dictionary(deps)
  );
  return rts(new Router());
}
