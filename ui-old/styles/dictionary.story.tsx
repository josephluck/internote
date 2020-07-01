import React from "react";

import { StoriesOf } from "../types";
import { Dictionary } from "./dictionary";

export default function (s: StoriesOf) {
  s("Dictionary", module)
    .add("With results", () => (
      <Dictionary isLoading={false} selectedWord="Design" />
    ))
    .add("Without results", () => (
      <Dictionary isLoading={false} selectedWord="Design" />
    ))
    .add("Loading", () => <Dictionary isLoading selectedWord="Design" />);
}
