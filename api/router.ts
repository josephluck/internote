import * as Router from "koa-router";
import { Dependencies } from "./";
import { compose } from "ramda";
import user from "./domains/user/routes";
import auth from "./domains/auth/routes";
import note from "./domains/note/routes";
import { Option } from "space-lift";
import { UserEntity } from "./domains/user/entity";

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
  // Could add authentication checks here
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
    note(deps)
  );
  return rts(new Router());
}
