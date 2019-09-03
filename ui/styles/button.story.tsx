import React from "react";
import { Button } from "./button";
import { StoriesOf } from "../types";

export default function alert(s: StoriesOf) {
  s("Button", module).add("default", () => {
    return <Button>Button</Button>;
  });
}
