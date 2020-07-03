import { InternoteEditorElement } from "@internote/lib/editor-types";
import { GetSnippetDTO } from "@internote/snippets-service/types";
import React, { useCallback } from "react";
import { useState } from "react";

import { createSnippet } from "../store/snippets/snippets";

interface Context {
  createSnippetModalOpen: boolean;
  snippetToInsert: null | GetSnippetDTO;
  snippetsMenuShowing: boolean;
  snippetSelection: InternoteEditorElement[];
  createSnippetTitle: string;
  setCreateSnippetTitle: (title: string) => void;
  setSnippetSelection: (selection: InternoteEditorElement[]) => void;
  clearCreateSnippet: () => void;
  setSnippetToInsert: (snippetToInsert: GetSnippetDTO | null) => void;
  setSnippetsMenuShowing: (showing: boolean) => void;
  setCreateSnippetModalOpen: (showing: boolean) => void;
  finaliseCreateSnippet: () => void;
}

/**
 * Default context
 */
export const SnippetsContext = React.createContext<Context>({
  createSnippetModalOpen: false,
  snippetToInsert: null,
  snippetsMenuShowing: false,
  snippetSelection: [],
  createSnippetTitle: "",
  setCreateSnippetTitle: () => void null,
  setSnippetSelection: () => void null,
  clearCreateSnippet: () => void null,
  setSnippetToInsert: () => void null,
  setSnippetsMenuShowing: () => void null,
  setCreateSnippetModalOpen: () => void null,
  finaliseCreateSnippet: () => void null,
});

/**
 * Context implementation and logic - wraps the app that needs
 * snippets functionality
 */
export function SnippetsProvider({ children }: { children: React.ReactNode }) {
  const [snippetSelection, setSnippetSelection] = useState<
    InternoteEditorElement[]
  >([]);

  const [snippetToInsert, setSnippetToInsert] = useState<GetSnippetDTO | null>(
    null
  );

  const [createSnippetModalOpen, setCreateSnippetModalOpen] = useState(false);

  const [snippetsMenuShowing, setSnippetsMenuShowing] = useState(false);

  const [createSnippetTitle, setCreateSnippetTitle] = useState("");

  const clearCreateSnippet = useCallback(() => {
    // TODO move stuff from the modal to here
  }, []);

  const finaliseCreateSnippet = useCallback(() => {
    createSnippet({
      title: createSnippetTitle,
      content: snippetSelection as any,
    });
  }, [createSnippetTitle, snippetSelection]);

  const ctx: Context = {
    snippetToInsert,
    snippetsMenuShowing,
    createSnippetModalOpen,
    setSnippetsMenuShowing,
    setSnippetToInsert,
    setCreateSnippetModalOpen,
    snippetSelection,
    setSnippetSelection,
    clearCreateSnippet,
    finaliseCreateSnippet,
    setCreateSnippetTitle,
    createSnippetTitle,
  };

  return (
    <SnippetsContext.Provider value={ctx}>{children}</SnippetsContext.Provider>
  );
}
