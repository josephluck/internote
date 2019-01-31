import CookieFactory from "universal-cookie";
import { isServer } from "./window";

const AUTH_COOKIE = "INTERNOTE_AUTH";

export function authTokenCookieOptions() {
  return {
    encode: String,
    path: "/",
    expires: new Date(Date.now() + +2.592e9)
  };
}

export function expireCookie() {
  return {
    encode: String,
    path: "/",
    expires: new Date(Date.now() - +2.592e9) // Brute force expiry
  };
}

export default function(cookie?: string) {
  const cookies = isServer() ? new CookieFactory(cookie) : new CookieFactory();

  function persistAuthToken(token: string) {
    cookies.set(AUTH_COOKIE, token, authTokenCookieOptions());
  }

  function removeAuthToken() {
    // NB: failing removal, brute force expiry
    const token = getAuthToken();
    if (token) {
      cookies.set(AUTH_COOKIE, token, expireCookie());
    }
    cookies.remove(AUTH_COOKIE);
  }

  function getAuthToken(): string | undefined {
    const token = cookies.get(AUTH_COOKIE);
    return token ? token : undefined;
  }

  return {
    persistAuthToken,
    removeAuthToken,
    getAuthToken
  };
}
