import React from "react";
import { StoriesOf } from "../types";
import { SnippetsButton } from "./snippets-menu";

export default function (s: StoriesOf) {
  s("SnippetsMenu", module).add("No progress", () => (
    <SnippetsButton onSnippetSelected={console.log} hasHighlighted />
  ));
}
