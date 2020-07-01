import React from "react";

import { StoriesOf } from "../types";
import { Input, InputWithLabel } from "./input";

export default function (s: StoriesOf) {
  s("Input", module)
    .add("Without value", () => <Input value="" />)
    .add("With value", () => <Input value="Input with icons" />)
    .add("With label", () => (
      <InputWithLabel label="Input label" value="Input with label" />
    ));
}
