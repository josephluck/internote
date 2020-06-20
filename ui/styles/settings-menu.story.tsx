import React from "react";
import { StoriesOf } from "../types";
import { SettingsMenu } from "./settings-menu";
import { Flex } from "@rebass/grid";

export default function (s: StoriesOf) {
  s("SettingsMenu", module).add("default", () => (
    <Flex justifyContent="flex-end">
      <SettingsMenu onMenuToggled={console.log} />
    </Flex>
  ));
}
