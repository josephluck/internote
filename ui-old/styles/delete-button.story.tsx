import React from "react";

import { StoriesOf } from "../types";
import { DeleteButton } from "./delete-button";

export default function (s: StoriesOf) {
  s("DeleteButton", module).add("default", () => (
    <DeleteButton onClick={console.log} />
  ));
}
