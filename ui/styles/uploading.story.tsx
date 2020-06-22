import React from "react";

import { StoriesOf } from "../types";
import { UnknownFile } from "./unknown-file";
import { Uploading } from "./uploading";

export default function (s: StoriesOf) {
  s("Uploading", module)
    .add("No progress", () => <Uploading name="file.md" progress={0} />)
    .add("In progress", () => <Uploading name="file.md" progress={30} />)
    .add("Uploaded", () => <Uploading name="file.md" progress={100} />)
    .add("With file above", () => (
      <div>
        <UnknownFile
          name="file.md"
          extension="md"
          onDownloadFile={console.log}
        />
        <br />
        <br />
        <Uploading name="file.md" progress={30} />
      </div>
    ));
}
