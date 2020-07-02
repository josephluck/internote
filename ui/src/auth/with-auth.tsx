import { Redirect } from "@reach/router";
import * as React from "react";

import { useTwineActions, useTwineState } from "../store";

interface Options {
  restricted: boolean;
}

export const withAuth = <C extends React.ComponentType>(
  Child: C,
  { restricted }: Options
) => (props: any) => {
  const initialize = useTwineActions((actions) => actions.auth.initialize);
  const isAuthenticated = useTwineState((state) => Boolean(state.auth.session));

  React.useEffect(() => {
    initialize(restricted);
  }, [restricted]);

  if (!isAuthenticated) {
    return <Redirect to="/authenticate" />;
  }

  return <Child {...props} />;
};
