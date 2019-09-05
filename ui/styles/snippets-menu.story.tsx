import React from "react";
import { StoriesOf } from "../types";
import { SnippetsMenu } from "./snippets-menu";

export default function(s: StoriesOf) {
  s("SnippetsMenu", module).add("No progress", () => (
    <SnippetsMenu onSnippetSelected={console.log} hasHighlighted />
  ));
}
