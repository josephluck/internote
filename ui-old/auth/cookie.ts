import { CookieSetOptions } from "universal-cookie";

const days30InMs = 2.592e9;

function makeExpiryDate(adjustmentInMs: number) {
  return new Date(Date.now() + adjustmentInMs);
}

export function authTokenCookieOptions(): CookieSetOptions {
  return {
    path: "/",
    expires: makeExpiryDate(days30InMs),
  };
}

export function expireCookie() {
  return {
    path: "/",
    expires: new Date(Date.now() - days30InMs), // Brute force expiry
  };
}
