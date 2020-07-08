import { InternoteEditorElement } from "@internote/lib/editor-types";
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
      <InternoteEditor initialValue={welcomeValue}></InternoteEditor>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  min-height: 100%;
`;

const welcomeValue: InternoteEditorElement[] = [
  {
    type: "heading-one",
    children: [
      {
        text: "👋 Welcome to Internote",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Internote is a note editor with a focus on distraction-free content creation. It's free to use and super easy to get started. Give it a go, this page is editable.",
      },
    ],
  },
];
