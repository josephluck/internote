import * as Koa from "koa";

export default function() {
  return async function exceptions(ctx: Koa.Context, next: () => Promise<any>) {
    if (ctx.body === undefined) {
      // Handle not found from DB
      ctx.status = 404;
      next();
    } else {
      try {
        await next();
      } catch (err) {
        console.log(err);
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit("error", err, ctx);
      }
    }
  };
}
