import React from "react";

import { StoriesOf } from "../types";
import { Logo } from "./logo";

export default function (s: StoriesOf) {
  s("Logo", module)
    .add("Small", () => <Logo>Internote</Logo>)
    .add("Large", () => <Logo large>Internote</Logo>);
}
