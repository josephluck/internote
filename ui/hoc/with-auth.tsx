import * as React from "react";
import Router from "next/router";
import { NextContext } from "next";
import { Store } from "../store";
import { isServer } from "../utilities/window";
import cookie from "../utilities/cookie";

interface Options {
  restricted: boolean;
}

export function withAuth<C extends typeof React.Component>(
  Child: C,
  options: Options = { restricted: true }
) {
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
          context.store.actions.auth.signOut();
        } else if (
          !context.store.state.auth.session ||
          cookies.isTokenNearExpiry()
        ) {
          await context.store.actions.auth.session({ token });
        }
      }

      await initAuthRequest().catch(() => {
        context.store.actions.auth.signOut();
        if (options.restricted) {
          redirectToLogin();
        }
      });

      const getInitialProps: any = (Child as any).getInitialProps;

      if (!!context.store.getState().auth.session) {
        return getInitialProps ? getInitialProps(context) : {};
      } else if (options.restricted) {
        return {};
      }
      redirectToLogin();
    }

    render() {
      return <Child {...this.props as any} />;
    }
  };
}
