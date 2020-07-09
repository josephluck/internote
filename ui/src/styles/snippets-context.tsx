import { InternoteEditorElement } from "@internote/lib/editor-types";
import React, { useCallback } from "react";
import { useState } from "react";

import { createSnippet } from "../store/snippets/snippets";

interface Context {
  createSnippetModalOpen: boolean;
  snippetsMenuShowing: boolean;
  snippetSelection: InternoteEditorElement[];
  createSnippetTitle: string;
  setCreateSnippetTitle: (title: string) => void;
  setSnippetSelection: (selection: InternoteEditorElement[]) => void;
  clearCreateSnippet: () => void;
  setSnippetsMenuShowing: (showing: boolean) => void;
  setCreateSnippetModalOpen: (showing: boolean) => void;
  finaliseCreateSnippet: () => void;
}

/**
 * Default context
 */
export const SnippetsContext = React.createContext<Context>({
  createSnippetModalOpen: false,
  snippetsMenuShowing: false,
  snippetSelection: [],
  createSnippetTitle: "",
  setCreateSnippetTitle: () => void null,
  setSnippetSelection: () => void null,
  clearCreateSnippet: () => void null,
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

  const [createSnippetModalOpen, setCreateSnippetModalOpen] = useState(false);

  const [snippetsMenuShowing, setSnippetsMenuShowing] = useState(false);

  const [createSnippetTitle, setCreateSnippetTitle] = useState("");

  const clearCreateSnippet = useCallback(() => {
    setCreateSnippetModalOpen(false);
    setCreateSnippetTitle("");
    setSnippetsMenuShowing(true);
  }, []);

  const finaliseCreateSnippet = useCallback(async () => {
    await createSnippet({
      title: createSnippetTitle,
      content: snippetSelection as any,
    });
  }, [createSnippetTitle, snippetSelection, clearCreateSnippet]);

  const ctx: Context = {
    snippetsMenuShowing,
    createSnippetModalOpen,
    setSnippetsMenuShowing,
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
