import React from "react";
import { StoriesOf } from "../types";
import { ExportMenu } from "./export-menu";
import { Flex } from "@rebass/grid";

export default function (s: StoriesOf) {
  s("ExportMenu", module).add("default", () => <Menu />);
}

function Menu() {
  return (
    <Flex justifyContent="flex-end">
      <ExportMenu noteId="" onMenuToggled={console.log} />
    </Flex>
  );
}
