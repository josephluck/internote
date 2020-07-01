import React from "react";

import { StoriesOf } from "../types";
import { NewTag, Tag } from "./tag";

export default function (s: StoriesOf) {
  s("Tag", module)
    .add("Not focused", () => <Tag isFocused={false}>#internote</Tag>)
    .add("Focused", () => <Tag isFocused>#internote</Tag>)
    .add("Large", () => (
      <Tag isFocused={false} large>
        #internote
      </Tag>
    ))
    .add("New tag", () => <NewTag isFocused={false}>Create #design</NewTag>)
    .add("New tag large", () => (
      <NewTag isFocused={false} large>
        Create #design
      </NewTag>
    ));
}
