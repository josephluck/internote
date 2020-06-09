import React from "react";
import { StoriesOf } from "../types";
import { ToolbarButton } from "./toolbar-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

export default function (s: StoriesOf) {
  s("ToolbarButton", module)
    .add("default", () => (
      <ToolbarButton
        onClick={console.log}
        isActive={false}
        shortcutNumber={1}
        shortcutShowing={false}
      >
        <FontAwesomeIcon icon={faRocket}></FontAwesomeIcon>
      </ToolbarButton>
    ))
    .add("Active", () => (
      <ToolbarButton
        onClick={console.log}
        isActive
        shortcutNumber={1}
        shortcutShowing={false}
      >
        <FontAwesomeIcon icon={faRocket}></FontAwesomeIcon>
      </ToolbarButton>
    ))
    .add("Shortcut showing", () => (
      <ToolbarButton
        onClick={console.log}
        isActive={false}
        shortcutNumber={1}
        shortcutShowing
      >
        <FontAwesomeIcon icon={faRocket}></FontAwesomeIcon>
      </ToolbarButton>
    ));
}
