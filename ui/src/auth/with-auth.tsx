import { navigate } from "@reach/router";
import { useEffect } from "react";

import { initialize } from "../store/auth/auth";
import { useStately } from "../store/store";

export const useAuthRedirect = (restricted: boolean) => {
  const isAuthenticated = useStately((state) => Boolean(state.auth.session));

  useEffect(() => {
    initialize(restricted);
  }, [restricted]);

  useEffect(() => {
    if (!isAuthenticated && restricted) {
      navigate("/authenticate");
    }
  }, [isAuthenticated, restricted]);
};
