import { Flex } from "@rebass/grid";
import React, { useCallback, useContext } from "react";

import { useTwineState } from "../store";
import { spacing } from "../theming/symbols";
import { Button } from "./button";
import { Input } from "./input";
import { Modal } from "./modal";
import { SnippetsContext } from "./snippets-context";

export function CreateSnippetModal() {
  const {
    createSnippetModalOpen,
    setCreateSnippetModalOpen,
    setSnippetsMenuShowing,
    finaliseCreateSnippet,
    createSnippetTitle,
    setCreateSnippetTitle,
  } = useContext(SnippetsContext);

  const handleCreateSnippet = useCallback(async () => {
    await finaliseCreateSnippet();
    setCreateSnippetModalOpen(false);
    setCreateSnippetTitle("");
    setSnippetsMenuShowing(true);
  }, [createSnippetTitle]);

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
        onClick={handleCreateSnippet}
        fullWidth
        disabled={createSnippetTitle.length === 0}
        loading={createSnippetLoading}
      >
        Create snippet
      </Button>
    </Modal>
  );
}
