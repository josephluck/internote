import { NextContext } from "next";
import { isServer } from "./window";
import Router from "next/router";

export function redirect(ctx: NextContext, location: string) {
  if (isServer() && ctx.res) {
    (ctx.res as any).redirect(location);
  } else {
    Router.push(location);
  }
}
