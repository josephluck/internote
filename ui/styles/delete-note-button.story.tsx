import React from "react";
import { StoriesOf } from "../types";
import { DeleteNoteButton } from "./delete-note-button";

export default function(s: StoriesOf) {
  s("DeleteNoteButton", module).add("default", () => (
    <DeleteNoteButton onClick={console.log} />
  ));
}
