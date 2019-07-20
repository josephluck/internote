import * as Cookies from "js-cookie";
import { isServer } from "../utilities/window";
import { Request } from "express";

interface Params {
  path: string;
  expires: number;
  domain: string;
  secure: boolean;
}

// This implementation is based on the amazon-cognito-auth-js/es/CookieStorage.js
export class CredentialsStorage {
  req: Request;
  path: string;
  expires: number;
  domain: string;
  secure: boolean;

  constructor(params: Params) {
    this.path = params.path;
    this.expires = params.expires;
    this.domain = params.domain;
    this.secure = params.secure;
  }

  setReq(req: Request) {
    this.req = req;
  }

  setItem(key: string, value: string) {
    Cookies.set(key, value, {
      path: this.path,
      expires: this.expires,
      domain: this.domain,
      secure: this.secure
    });

    return Cookies.get(key);
  }

  getItemClient(key: string) {
    return Cookies.get(key);
  }

  getItemServer(passedKey: string) {
    const key = encodeURIComponent(passedKey); // there are @ symbols in the passedKey sometimes
    const cookieItem = this.req.cookies && this.req.cookies[key];
    return cookieItem;
  }

  getItem(key: string) {
    return isServer() ? this.getItemServer(key) : this.getItemClient(key);
  }

  removeItem(key: string) {
    return Cookies.remove(key, {
      path: this.path,
      domain: this.domain,
      secure: this.secure
    });
  }

  clear() {
    const cookies = Cookies.get();
    for (let index = 0; index < cookies.length; ++index) {
      Cookies.remove(cookies[index]);
    }
    return {};
  }
}
