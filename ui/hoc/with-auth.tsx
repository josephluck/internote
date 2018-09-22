import * as React from "react";
import { getAuthenticationTokenFromContext } from "../utilities/cookie";
import { redirect } from "../utilities/redirect";

export function withAuth(Child: any) {
  return class WithAuth extends React.Component<{}, {}> {
    static async getInitialProps(ctx) {
      return getAuthenticationTokenFromContext(ctx).fold(
        () => {
          redirect(ctx, "/login");
          return {};
        },
        async token => {
          await ctx.store.actions.session(token);
          return Child.getInitialProps ? await Child.getInitialProps(ctx) : {};
        }
      );
    }
    render() {
      return <Child {...this.props} />;
    }
  };
}
