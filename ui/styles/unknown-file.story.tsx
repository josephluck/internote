import React from "react";
import { StoriesOf } from "../types";
import { UnknownFile } from "./unknown-file";

export default function (s: StoriesOf) {
  s("UnknownFile", module)
    .add("Markdown file", () => (
      <UnknownFile
        extension="md"
        name="file-name.md"
        onDownloadFile={console.log}
      />
    ))
    .add("HTML file", () => (
      <UnknownFile
        extension="html"
        name="index.html"
        onDownloadFile={console.log}
      />
    ));
}
