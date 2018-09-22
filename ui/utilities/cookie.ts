import { NextContext } from "next";
import { Option } from "space-lift";
import * as cookieParser from "cookie";
import { isServer } from "./window";

export const authTokenCookieKey = "AUTH_TOKEN";

export function getAuthenticationToken(ctx: NextContext): Option<string> {
  const cookie =
    isServer() && ctx.req && ctx.req.headers.cookie
      ? (ctx.req.headers.cookie as string)
      : document.cookie;
  return Option(cookieParser.parse(cookie)[authTokenCookieKey]);
}
