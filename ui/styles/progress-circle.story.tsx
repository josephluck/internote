import React from "react";
import { StoriesOf } from "../types";
import { ProgressCircle } from "./progress-circle";

export default function(s: StoriesOf) {
  s("ProgressCircle", module)
    .add("No progress", () => <ProgressCircle progress={0} />)
    .add("Some progress", () => <ProgressCircle progress={30} />)
    .add("Full progress", () => <ProgressCircle progress={100} />)
    .add("Custom size", () => <ProgressCircle progress={30} size={50} />)
    .add("Custom size & stroke", () => (
      <ProgressCircle progress={30} size={50} stroke={10} />
    ))
    .add("Without percentage", () => (
      <ProgressCircle showPercentage={false} progress={30} />
    ));
}
