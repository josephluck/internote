import React from "react";
import { StoriesOf } from "../types";
import { TagsList } from "./tags-list";

export default function(s: StoriesOf) {
  s("TagsList", module)
    .add("Without search", () => (
      <TagsList
        search=""
        tags={tags}
        newTagSaving={false}
        onTagSelected={console.log}
        onCreateNewTag={console.log}
      />
    ))
    .add("With search", () => (
      <TagsList
        search="es"
        tags={tags}
        newTagSaving={false}
        onTagSelected={console.log}
        onCreateNewTag={console.log}
      />
    ))
    .add("With no tags", () => (
      <TagsList
        search=""
        tags={[]}
        newTagSaving={false}
        onTagSelected={console.log}
        onCreateNewTag={console.log}
      />
    ))
    .add("With no results for search", () => (
      <TagsList
        search="esfwefew"
        tags={tags}
        newTagSaving={false}
        onTagSelected={console.log}
        onCreateNewTag={console.log}
      />
    ))
    .add("With saving", () => (
      <TagsList
        search="es"
        tags={tags}
        newTagSaving
        onTagSelected={console.log}
        onCreateNewTag={console.log}
      />
    ));
}

const tags = [
  "#design",
  "#internote",
  "#react",
  "#lambda",
  "#serverless",
  "#aws"
];
