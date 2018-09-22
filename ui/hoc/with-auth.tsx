import * as React from "react";
import { getAuthenticationToken } from "../utilities/cookie";
import { redirect } from "../utilities/redirect";

export function withAuth(Child: any) {
  return class WithAuth extends React.Component<{}, {}> {
    static async getInitialProps(ctx) {
      getAuthenticationToken(ctx).fold(
        () => redirect(ctx, "/login"),
        token => {
          console.log("Got token", { token });
        }
      );
    }
    render() {
      return <Child {...this.props} />;
    }
  };
}
