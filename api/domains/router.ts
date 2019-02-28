import * as Router from "koa-router";
import { compose } from "ramda";
import { Option } from "space-lift";
import { Dependencies } from "../app";
import user from "./user/routes";
import auth from "./auth/routes";
import note from "./note/routes";
import preferences from "./preferences/routes";
import speech from "./speech/routes";
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

export function route(deps: Dependencies, cb: ControllerFn) {
  // TODO: Could automatically throw 403 if user not present
  return async function(ctx: Router.IRouterContext, next: () => Promise<any>) {
    const user = ctx.state.user
      ? await deps.db.manager.findOne(UserEntity, ctx.state.user)
      : undefined;
    await cb(ctx, Option(user));
    next();
  };
}

export default function routes(deps: Dependencies) {
  const rts = compose(
    user(deps),
    auth(deps),
    note(deps),
    preferences(deps),
    speech(deps)
  );
  return rts(new Router());
}
