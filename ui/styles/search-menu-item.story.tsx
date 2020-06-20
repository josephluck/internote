import React from "react";
import { StoriesOf } from "../types";
import { SearchMenuItem } from "./search-menu-item";

export default function (s: StoriesOf) {
  s("SearchMenuItem", module)
    .add("default", () => (
      <SearchMenuItem
        content="Menu item"
        searchText=""
        onDelete={console.log}
        onSelect={console.log}
      />
    ))
    .add("With search highlight", () => (
      <SearchMenuItem
        content="Menu item"
        searchText="ente"
        isSelected
        onDelete={console.log}
        onSelect={console.log}
      />
    ))
    .add("Selected", () => (
      <SearchMenuItem
        content="Menu item"
        searchText=""
        isSelected
        onDelete={console.log}
        onSelect={console.log}
      />
    ))
    .add("Loading", () => (
      <SearchMenuItem
        content="Menu item"
        searchText=""
        isLoading
        onDelete={console.log}
        onSelect={console.log}
      />
    ))
    .add("Deleting", () => (
      <SearchMenuItem
        content="Menu item"
        searchText=""
        deleteLoading
        onDelete={console.log}
        onSelect={console.log}
      />
    ))
    .add("Selected & deleting", () => (
      <SearchMenuItem
        content="Menu item"
        searchText=""
        isSelected
        deleteLoading
        onDelete={console.log}
        onSelect={console.log}
      />
    ));
}
