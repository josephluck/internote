import React from "react";

import { StoriesOf } from "../types";
import { Heading } from "./heading";

export default function (s: StoriesOf) {
  s("Heading", module).add("default", () => <Heading note={null} />);
}
