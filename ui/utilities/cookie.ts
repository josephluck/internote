import { NextContext } from "next";
import { Option } from "space-lift";
import * as cookieParser from "cookie";
import { isServer } from "./window";

export const authTokenCookieKey = "AUTH_TOKEN";

export function getAuthenticationTokenFromContext(
  ctx: NextContext
): Option<string> {
  const cookie =
    isServer() && ctx.req && ctx.req.headers.cookie
      ? (ctx.req.headers.cookie as string)
      : typeof document !== "undefined" && document.cookie
        ? document.cookie
        : "";
  return Option(cookieParser.parse(cookie)[authTokenCookieKey]);
}

export function setAuthenticationCookie(token: string): void {
  if (!isServer() && typeof document !== "undefined") {
    document.cookie = cookieParser.serialize(authTokenCookieKey, token, {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      path: "/"
    });
  }
}

export function removeAuthenticationCookie(): void {
  if (!isServer() && typeof document !== "undefined") {
    document.cookie = cookieParser.serialize(authTokenCookieKey, "", {
      expires: new Date(new Date().setFullYear(1970)),
      path: "/"
    });
  }
}
