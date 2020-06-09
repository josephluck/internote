import React from "react";
import { StoriesOf } from "../types";
import { InputWithIcons } from "./input-with-icons";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

export default function (s: StoriesOf) {
  s("InputWithIcons", module)
    .add("Without value", () => <InputWithIcons value="" />)
    .add("With value", () => <InputWithIcons value="Input with icons" />)
    .add("With custom left icon", () => (
      <InputWithIcons leftIcon={faBolt} value="Input with icons" />
    ));
}
