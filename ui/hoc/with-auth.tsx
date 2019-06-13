import * as React from "react";
import Router from "next/router";
import { NextContext } from "next";
import { Store } from "../store";
import { isServer } from "../utilities/window";
import cookie from "../utilities/cookie";

export interface AuthenticationOptions {
  restricted?: boolean;
}

export function withAuth<C extends typeof React.Component>(Child: C) {
  return class WrappedComponent extends React.PureComponent<any, any> {
    static async getInitialProps(context: NextContext<{}> & { store: Store }) {
      function redirectToLogin() {
        if (context.res) {
          context.res.writeHead(302, {
            Location: "/login"
          });
          context.res.end();
        } else if (!isServer()) {
          Router.push("/login");
        }
      }

      async function initAuthRequest(): Promise<any> {
        const cookieString =
          isServer() && context.req && context.req.headers
            ? (context.req.headers.cookie as string) || ""
            : "";
        const cookies = cookie(cookieString);
        const token = cookies.getAuthToken();
        if (!token) {
          context.store.actions.rest.signOut();
        } else if (
          !context.store.state.rest.session ||
          cookies.isTokenNearExpiry()
        ) {
          await context.store.actions.rest.session({ token });
        }
      }

      await initAuthRequest().catch(() => {
        context.store.actions.rest.signOut();
        redirectToLogin();
      });

      const getInitialProps: any = (Child as any).getInitialProps;

      if (!!context.store.getState().rest.session) {
        return getInitialProps ? getInitialProps(context) : {};
      } else {
        redirectToLogin();
        return {};
      }
    }

    render() {
      return <Child {...this.props as any} />;
    }
  };
}
