import { Flex } from "@rebass/grid";
import React, { useContext } from "react";

import { spacing } from "../theming/symbols";
import { Button } from "./button";
import { Input } from "./input";
import { Modal } from "./modal";
import { SnippetsContext } from "./snippets-context";

export function CreateSnippetModal() {
  const {
    createSnippetModalOpen,
    setCreateSnippetModalOpen,
    createSnippetTitle,
    finaliseCreateSnippet,
    setCreateSnippetTitle,
  } = useContext(SnippetsContext);

  const createSnippetLoading = false;

  return (
    <Modal
      open={createSnippetModalOpen}
      withOverlay
      onClose={() => {
        setCreateSnippetTitle("");
        setCreateSnippetModalOpen(false);
      }}
    >
      <Flex mb={spacing._1}>
        To finish creating your snippet, give it a title:
      </Flex>
      <Flex mb={spacing._1}>
        {createSnippetModalOpen ? (
          <Input
            value={createSnippetTitle}
            onChange={(e) => setCreateSnippetTitle(e.target.value)}
            autoFocus
          />
        ) : null}
      </Flex>
      <Button
        onClick={finaliseCreateSnippet}
        fullWidth
        disabled={createSnippetTitle.length === 0}
        loading={createSnippetLoading}
      >
        Create snippet
      </Button>
    </Modal>
  );
}
