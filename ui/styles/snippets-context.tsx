import React from "react";
import { Snippet } from "../store/snippets";

interface Context {
  createSnippetModalOpen: boolean;
  snippetToInsert: null | Snippet;
  snippetsMenuShowing: boolean;
  setSnippetToInsert: (snippetToInsert: Snippet) => void;
  setSnippetsMenuShowing: (showing: boolean) => void;
  setCreateSnippetModalOpen: (showing: boolean) => void;
}

/**
 * Default context
 */
export const SnippetsContext = React.createContext<Context>({
  createSnippetModalOpen: false,
  snippetToInsert: null,
  snippetsMenuShowing: false,
  setSnippetToInsert: () => {},
  setSnippetsMenuShowing: () => {},
  setCreateSnippetModalOpen: () => {}
});

/**
 * Context implementation and logic - wraps the app that needs
 * snippets functionality
 */
export function SnippetsProvider({ children }: { children: React.ReactNode }) {
  function setSnippetToInsert(snippetToInsert: Snippet) {
    setCtx(prevState => ({
      ...prevState,
      snippetToInsert
    }));
  }

  function setSnippetsMenuShowing(snippetsMenuShowing: boolean) {
    setCtx(prevState => ({
      ...prevState,
      snippetsMenuShowing
    }));
  }

  function setCreateSnippetModalOpen(createSnippetModalOpen: boolean) {
    setCtx(prevState => ({
      ...prevState,
      createSnippetModalOpen
    }));
  }

  /**
   * Stores the current context
   */
  const [ctx, setCtx] = React.useState<Context>({
    snippetToInsert: null,
    snippetsMenuShowing: false,
    createSnippetModalOpen: false,
    setSnippetsMenuShowing,
    setSnippetToInsert,
    setCreateSnippetModalOpen
  });

  return (
    <SnippetsContext.Provider value={ctx}>{children}</SnippetsContext.Provider>
  );
}
