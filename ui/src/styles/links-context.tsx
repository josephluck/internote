import { LinkElement } from "@internote/lib/editor-types";
import React, { useCallback } from "react";
import { useState } from "react";

import { useInternoteEditor } from "./editor/hooks";

interface Context {
  createLinkModalOpen: boolean;
  linkHref: string;
  linkLabel: string;
  setLinkLabel: (label: string) => void;
  setLinkHref: (href: string) => void;
  clearCreateLink: () => void;
  setCreateLinkModalOpen: (showing: boolean) => void;
  finaliseCreateLink: () => void;
}

/**
 * Default context
 */
export const LinksContext = React.createContext<Context>({
  createLinkModalOpen: false,
  linkHref: "",
  linkLabel: "",
  setLinkLabel: () => void null,
  setLinkHref: () => void null,
  clearCreateLink: () => void null,
  setCreateLinkModalOpen: () => void null,
  finaliseCreateLink: () => void null,
});

/**
 * Context implementation and logic - wraps the app that needs
 * links functionality
 */
export function LinksProvider({ children }: { children: React.ReactNode }) {
  const { replaceSelection } = useInternoteEditor();
  const [linkHref, setLinkHref] = useState("");

  const [createLinkModalOpen, setCreateLinkModalOpen] = useState(false);

  const [linkLabel, setLinkLabel] = useState("");

  const clearCreateLink = useCallback(() => {
    setCreateLinkModalOpen(false);
    setLinkLabel("");
    setLinkHref("");
  }, []);

  const finaliseCreateLink = useCallback(() => {
    const link: LinkElement = {
      type: "link",
      href: linkHref,
      children: [{ text: linkLabel }],
    };
    replaceSelection([link]);
    clearCreateLink();
  }, [linkLabel, linkHref, clearCreateLink, replaceSelection]);

  const ctx: Context = {
    createLinkModalOpen,
    setCreateLinkModalOpen,
    linkHref,
    setLinkHref,
    clearCreateLink,
    finaliseCreateLink,
    setLinkLabel,
    linkLabel,
  };

  return <LinksContext.Provider value={ctx}>{children}</LinksContext.Provider>;
}
