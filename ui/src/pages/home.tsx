import { RouteComponentProps } from "@reach/router";
import React, { useEffect } from "react";

import { navigateToFirstNote } from "../store/ui/ui";

export const Home: React.FunctionComponent<RouteComponentProps> = () => {
  useEffect(() => {
    navigateToFirstNote();
  }, []);
  return null;
};
