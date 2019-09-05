import React from "react";
import { StoriesOf } from "../types";
import { DictionaryButton } from "./dictionary-button";

export default function(s: StoriesOf) {
  s("DictionaryButton", module).add("default", () => (
    <DictionaryButton isShowing onClick={console.log} />
  ));
}
