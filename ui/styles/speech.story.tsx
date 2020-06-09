import React from "react";
import { StoriesOf } from "../types";
import { Speech } from "./speech";

export default function (s: StoriesOf) {
  s("Speech", module)
    .add("With audio file", () => (
      <Speech
        src="https://sample-videos.com/audio/mp3/crowd-cheering.mp3"
        isLoading={false}
        onRequest={console.log}
        onDiscard={console.log}
        onFinished={console.log}
      />
    ))
    .add("Without audio file", () => (
      <Speech
        src=""
        isLoading={false}
        onRequest={console.log}
        onDiscard={console.log}
        onFinished={console.log}
      />
    ))
    .add("Loading", () => (
      <Speech
        src=""
        isLoading
        onRequest={console.log}
        onDiscard={console.log}
        onFinished={console.log}
      />
    ));
}
