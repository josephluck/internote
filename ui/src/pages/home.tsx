import { FULL_SCHEMA_WELCOME_MESSAGE } from "@internote/lib/schema-examples";
import { RouteComponentProps } from "@reach/router";
import React, { useEffect } from "react";
import styled from "styled-components";

import { validateSession } from "../auth/storage";
import { useStately } from "../store/store";
import { navigateToFirstNote } from "../store/ui/ui";
import { InternoteEditor } from "../styles/editor/internote-editor";

export const Home: React.FunctionComponent<RouteComponentProps> = () => {
  const session = useStately((state) => state.auth.session);
  const isAuthenticated = validateSession(session);

  useEffect(() => {
    if (isAuthenticated) {
      navigateToFirstNote();
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Wrapper>
      <InternoteEditor
        initialValue={FULL_SCHEMA_WELCOME_MESSAGE}
        autoFocus={false}
        topPadding={false}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  min-height: 100%;
`;
