import React from "react";

import { StoriesOf } from "../types";
import { EmojiList } from "./emoji-list";

export default function (s: StoriesOf) {
  s("EmojiList", module)
    .add("Without search", () => (
      <EmojiList search="" onEmojiSelected={console.log} />
    ))
    .add("With search", () => (
      <EmojiList search="smi" onEmojiSelected={console.log} />
    ));
}
