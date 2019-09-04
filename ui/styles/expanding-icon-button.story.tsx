import React from "react";
import { StoriesOf } from "../types";
import { ExpandingIconButton } from "./expanding-icon-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

export default function(s: StoriesOf) {
  s("ExpandingIconButton", module).add("With search", () => (
    <ExpandingIconButton
      forceShow={false}
      icon={<FontAwesomeIcon icon={faExpand} />}
      collapsedContent={<span>Collapsed content</span>}
    />
  ));
}
