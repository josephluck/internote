import { Redirect } from "@reach/router";
import * as React from "react";

import { initialize } from "../store/auth/auth";
import { useStately } from "../store/store";

interface Options {
  restricted: boolean;
}

export const withAuth = <C extends React.ComponentType>(
  Child: C,
  { restricted }: Options
) => (props: any) => {
  const isAuthenticated = useStately((state) => Boolean(state.auth.session));

  React.useEffect(() => {
    initialize(restricted);
  }, [restricted]);

  if (!isAuthenticated) {
    return <Redirect to="/authenticate" />;
  }

  return <Child {...props} />;
};
