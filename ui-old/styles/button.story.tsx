import React from "react";

import { StoriesOf } from "../types";
import { Button } from "./button";

export default function (s: StoriesOf) {
  s("Button", module)
    .add("default", () => {
      return <Button>Button</Button>;
    })
    .add("Secondary", () => {
      return <Button secondary>Button</Button>;
    })
    .add("Small", () => {
      return <Button small>Button</Button>;
    })
    .add("Full width", () => {
      return <Button fullWidth>Button</Button>;
    })
    .add("Loading", () => {
      return <Button loading>Button</Button>;
    })
    .add("Full width small loading", () => {
      return (
        <Button small fullWidth loading>
          Button
        </Button>
      );
    });
}