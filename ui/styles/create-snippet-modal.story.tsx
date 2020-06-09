import React, { useContext, useEffect } from "react";
import { StoriesOf } from "../types";
import { CreateSnippetModal } from "./create-snippet-modal";
import { SnippetsContext } from "./snippets-context";

export default function (s: StoriesOf) {
  s("CreateSnippetModal", module).add("default", () => <Modal />);
}

function Modal() {
  const { setCreateSnippetModalOpen } = useContext(SnippetsContext);
  useEffect(() => {
    setCreateSnippetModalOpen(true);
  }, []);
  return <CreateSnippetModal onCreateSnippet={console.log as any} />;
}
