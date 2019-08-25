import React from "react";
import { Snippet } from "../store/snippets";

interface Context {
  /**
   * The snippet that _will_ be inserted.
   */
  snippetToInsert: null | Snippet;
  snippetsMenuShowing: boolean;
  setSnippetToInsert: (snippetToInsert: Snippet) => void;
  setSnippetsMenuShowing: (showing: boolean) => void;
}

/**
 * Default context
 */
export const SnippetsContext = React.createContext<Context>({
  snippetToInsert: null,
  snippetsMenuShowing: false,
  setSnippetToInsert: () => {},
  setSnippetsMenuShowing: () => {}
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

  /**
   * Stores the current context
   */
  const [ctx, setCtx] = React.useState<Context>({
    snippetToInsert: null,
    snippetsMenuShowing: false,
    setSnippetsMenuShowing,
    setSnippetToInsert
  });

  return (
    <SnippetsContext.Provider value={ctx}>{children}</SnippetsContext.Provider>
  );
}
