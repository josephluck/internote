import React from "react";
import { StoriesOf } from "../types";
import { DropdownMenu } from "./dropdown-menu";

export default function (s: StoriesOf) {
  s("DropdownMenu", module).add("showing", () => (
    <DropdownMenu showing>Dropdown menu</DropdownMenu>
  ));
}
