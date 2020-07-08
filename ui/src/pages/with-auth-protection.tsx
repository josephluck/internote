import { RouteComponentProps } from "@reach/router";
import React, { PropsWithChildren, useEffect } from "react";

import { validateSession } from "../auth/storage";
import { initialize } from "../store/auth/auth";
import { fetchNotes } from "../store/notes/notes";
import { useStately } from "../store/store";

export const withAuthProtection = <
  C extends React.FunctionComponent<RouteComponentProps>
>(
  Child: C
) => (props: PropsWithChildren<RouteComponentProps>) => {
  const notes = useStately((state) => state.notes.notes);
  const isAuthenticated = useStately((state) =>
    validateSession(state.auth.session)
  );

  useEffect(() => {
    const bootstrap = async () => {
      if (!isAuthenticated) {
        await initialize(true);
      } else {
        await fetchNotes();
      }
    };

    bootstrap();
  }, [isAuthenticated]);

  if (!isAuthenticated || !notes.length) {
    return <></>;
  }

  // @ts-ignore
  return <Child {...props} />;
};
