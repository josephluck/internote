import { RouteComponentProps } from "@reach/router";
import React, { useEffect } from "react";

import { useAuthRedirect } from "../auth/with-auth";
import { navigateToFirstNote } from "../store/ui/ui";

export const Home: React.FunctionComponent<RouteComponentProps> = () => {
  useAuthRedirect(true);

  useEffect(() => {
    navigateToFirstNote();
  }, []);
  return null;
};
