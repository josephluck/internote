import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { ToolbarButton } from "./toolbar-button";

export const DeleteButton: React.FunctionComponent<{ onClick: () => any }> = ({
  onClick,
}) => (
  <ToolbarButton
    icon={<FontAwesomeIcon icon={faTrash} />}
    label="Delete"
    onClick={onClick}
  />
);
