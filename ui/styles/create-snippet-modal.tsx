import React, { useContext, useState, useCallback } from "react";
import { SnippetsContext } from "./snippets-context";
import { Modal } from "./modal";
import { Input } from "./input";
import { Button } from "./button";
import { Flex } from "@rebass/grid";
import { spacing } from "../theming/symbols";
import { useTwineState } from "../store";

export function CreateSnippetModal({
  onCreateSnippet,
}: {
  onCreateSnippet: (title: string) => Promise<void>;
}) {
  const {
    createSnippetModalOpen,
    setCreateSnippetModalOpen,
    setSnippetsMenuShowing,
  } = useContext(SnippetsContext);
  const [createSnippetTitle, setCreateSnippetTitle] = useState("");
  const handleCreateSnippet = useCallback(async () => {
    await onCreateSnippet(createSnippetTitle);
    setCreateSnippetModalOpen(false);
    setCreateSnippetTitle("");
    setSnippetsMenuShowing(true);
  }, [createSnippetTitle]);
  const createSnippetLoading = useTwineState(
    (state) => state.snippets.loading.createSnippet
  );

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
