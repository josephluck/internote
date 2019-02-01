import * as React from "react";
import Router from "next/router";
import { Twine } from "twine-js";
import { NextContext } from "next";
import { State, Actions } from "../store";
import { isServer } from "../utilities/window";
import cookie from "../utilities/cookie";

export interface AuthenticationOptions {
  restricted?: boolean;
}

export function withAuth<C extends typeof React.Component>(Child: C) {
  return class WrappedComponent extends React.PureComponent<any, any> {
    static async getInitialProps(
      context: NextContext<{}> & { store: Twine.Return<State, Actions> }
    ) {
      function redirectToLogin() {
        if (context.res) {
          context.res.writeHead(302, {
            Location: "/login"
          });
        } else {
          Router.push("/login");
        }
      }

      async function initAuthRequest(): Promise<any> {
        const cookieString =
          isServer() && context.req && context.req.headers
            ? (context.req.headers.cookie as string) || ""
            : "";
        const cookies = cookie(cookieString);
        const authToken = cookies.getAuthToken();
        if (!authToken) {
          context.store.actions.signOut();
        } else {
          await context.store.actions.session(authToken);
        }
      }

      await initAuthRequest();

      const getInitialProps: any = (Child as any).getInitialProps;

      if (!!context.store.getState().session) {
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
