import * as React from "react";
import Router from "next/router";
import { Store } from "../store";
import { isServer } from "../utilities/window";
import { isNearExpiry } from "./api";
import { makeAuthStorage } from "./storage";
import { setCookie } from "nookies";
import { NextPageContext } from "next";

interface Options {
  restricted: boolean;
}

export function withAuth<C extends typeof React.Component>(
  Child: C,
  options: Options = { restricted: true }
) {
  return class WrappedComponent extends React.PureComponent<any, any> {
    static async getInitialProps(
      context: NextPageContext & {
        store: Store;
        getHeader: (header: string) => any;
        getHeaders: () => any;
      }
    ) {
      function redirectToLogin() {
        if (context.res) {
          context.res.writeHead(302, {
            Location: "/authenticate"
          });
          context.res.end();
        } else if (!isServer()) {
          Router.push("/authenticate");
        }
      }

      function getCookie() {
        if (isServer() && context.req && context.req.headers) {
          return context.req.headers.cookie || "";
        }
        if (!isServer()) {
          return document.cookie || "";
        }
        return "";
      }

      async function initAuthRequest(): Promise<any> {
        const cookie = getCookie();
        console.log({ cookie });
        const authStorage = makeAuthStorage(cookie);

        const session = authStorage.getSession();
        context.store.actions.auth.setSession(session);

        const tokenNearExpiry =
          session.refreshToken && isNearExpiry(session.expiration * 1000);

        const tokensMissing =
          !session.accessKeyId || !session.secretKey || !session.sessionToken;

        if (tokenNearExpiry || (session.refreshToken && tokensMissing)) {
          await context.store.actions.auth.refreshToken(session.refreshToken);
        }

        const latestSession = context.store.getState().auth.session;

        Object.keys(latestSession).forEach(key => {
          setCookie(context, key, latestSession[key], {
            path: "/",
            maxAge: latestSession.expiration
          });
        });
      }

      await initAuthRequest().catch(() => {
        context.store.actions.auth.signOut();
        if (options.restricted) {
          redirectToLogin();
        }
      });

      const session = context.store.getState().auth.session;
      const hasSession =
        session && session.accessToken && session.accessToken.length > 0;

      if (hasSession) {
        await context.store.actions.preferences.get();
        const getInitialProps: any = (Child as any).getInitialProps;
        return getInitialProps ? getInitialProps(context) : {};
      } else if (options.restricted) {
        redirectToLogin();
      }
      return {};
    }

    render() {
      return <Child {...(this.props as any)} />;
    }
  };
}
