import React from "react";
import { StoriesOf } from "../types";
import { FileUpload } from "./file-upload";

export default function(s: StoriesOf) {
  s("FileUpload", module).add("default", () => (
    <FileUpload
      noteId=""
      onUploadStarted={console.log}
      onUploadProgress={console.log}
      onUploadFinished={console.log}
    />
  ));
}
