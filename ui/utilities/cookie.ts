import CookieFactory, { CookieSetOptions } from "universal-cookie";
import { isServer } from "./window";

const AUTH_COOKIE = "INTERNOTE_AUTH";
const AUTH_COOKIE_EXPIRES = "INTERNOTE_AUTH_EXPIRES";

const days30InMs = 2.592e9;
const hours1InMs = 3.6e6;

function makeExpiryDate(adjustmentInMs: number) {
  return new Date(Date.now() + adjustmentInMs);
}

export function authTokenCookieOptions(): CookieSetOptions {
  return {
    path: "/",
    expires: makeExpiryDate(days30InMs)
  };
}

export function expireCookie() {
  return {
    path: "/",
    expires: new Date(Date.now() - days30InMs) // Brute force expiry
  };
}

export default function(cookie?: string) {
  const cookies = isServer() ? new CookieFactory(cookie) : new CookieFactory();

  function persistAuthToken(token: string) {
    const options = authTokenCookieOptions();
    cookies.set(AUTH_COOKIE, token, options);
    cookies.set(AUTH_COOKIE_EXPIRES, options.expires.valueOf(), options);
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

  function isTokenNearExpiry(): boolean {
    const expires = cookies.get(AUTH_COOKIE_EXPIRES);
    return expires && parseFloat(expires)
      ? parseFloat(expires) < makeExpiryDate(hours1InMs).valueOf()
      : true;
  }

  return {
    persistAuthToken,
    removeAuthToken,
    getAuthToken,
    isTokenNearExpiry
  };
}
