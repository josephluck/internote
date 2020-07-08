import { Flex } from "@rebass/grid";
import React, { useContext } from "react";

import { spacing } from "../theming/symbols";
import { Button } from "./button";
import { Input } from "./input";
import { LinksContext } from "./links-context";
import { Modal } from "./modal";

export function CreateLinkModal() {
  const {
    createLinkModalOpen,
    setCreateLinkModalOpen,
    linkHref,
    finaliseCreateLink,
    setLinkHref,
  } = useContext(LinksContext);

  return (
    <Modal
      open={createLinkModalOpen}
      withOverlay
      onClose={() => {
        setLinkHref("");
        setCreateLinkModalOpen(false);
      }}
    >
      <Flex mb={spacing._1}>Insert your link below:</Flex>
      <Flex mb={spacing._1}>
        <Input
          value={linkHref}
          onChange={(e) => setLinkHref(e.target.value)}
          autoFocus
        />
      </Flex>
      <Button
        onClick={finaliseCreateLink}
        fullWidth
        disabled={linkHref.length === 0}
      >
        Create link
      </Button>
    </Modal>
  );
}
