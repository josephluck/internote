import React from "react";
import { StoriesOf } from "../types";
import { Saving } from "./saving";

export default function(s: StoriesOf) {
  s("Saving", module)
    .add("Not saving", () => <Saving saving={false} />)
    .add("Saving", () => <Saving saving />);
}
