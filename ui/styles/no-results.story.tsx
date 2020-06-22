import React from "react";

import { StoriesOf } from "../types";
import { NoResults } from "./no-results";

export default function (s: StoriesOf) {
  s("NoResults", module).add("default", () => (
    <NoResults emojis="🔎 😒" message="Sorry, can't be done." />
  ));
}
