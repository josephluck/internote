import React from "react";
import { StoriesOf } from "../types";
import { Dictionary } from "./dictionary";
import { DictionaryResult } from "@internote/dictionary-service/types";

export default function(s: StoriesOf) {
  s("Dictionary", module)
    .add("With results", () => (
      <Dictionary results={results} requestedWord="Design" />
    ))
    .add("Without results", () => (
      <Dictionary results={[]} requestedWord="Fullstack Developer" />
    ))
    .add("Loading", () => (
      <Dictionary isLoading results={[]} requestedWord="Design" />
    ));
}

const results: DictionaryResult[] = [
  {
    word: "design",
    lexicalCategory: "Noun",
    definition:
      "a plan or drawing produced to show the look and function or workings of a building, garment, or other object before it is made",
    synonyms: [
      "plan",
      "blueprint",
      "drawing",
      "scale drawing",
      "sketch",
      "outline",
      "map",
      "plot",
      "diagram",
      "delineation",
      "draft",
      "depiction",
      "representation",
      "artist's impression",
      "scheme",
      "model",
      "prototype",
      "proposal",
      "plan",
      "blueprint",
      "drawing",
      "scale drawing",
      "sketch",
      "outline",
      "map",
      "plot",
      "diagram",
      "delineation",
      "draft",
      "depiction",
      "representation",
      "artist's impression",
      "scheme",
      "model",
      "prototype",
      "proposal"
    ],
    example: "he has just unveiled his design for the new museum"
  },
  {
    word: "design",
    lexicalCategory: "Noun",
    definition: "a decorative pattern",
    synonyms: ["pattern", "motif", "device"],
    example: "pottery with a lovely blue and white design"
  },
  {
    word: "design",
    lexicalCategory: "Noun",
    definition:
      "purpose or planning that exists behind an action, fact, or object",
    synonyms: [
      "intention",
      "aim",
      "purpose",
      "plan",
      "intent",
      "objective",
      "object",
      "goal",
      "end",
      "target",
      "point",
      "hope",
      "desire",
      "wish",
      "dream",
      "aspiration",
      "ambition",
      "idea"
    ],
    example: "the appearance of design in the universe"
  },
  {
    word: "design",
    lexicalCategory: "Verb",
    definition:
      "decide upon the look and functioning of (a building, garment, or other object), by making a detailed drawing of it",
    synonyms: [
      "plan",
      "draw plans of",
      "draw",
      "sketch",
      "outline",
      "map out",
      "plot",
      "block out",
      "delineate",
      "draft",
      "depict",
      "invent",
      "originate",
      "create",
      "think up",
      "come up with",
      "devise",
      "form",
      "formulate",
      "conceive",
      "intend",
      "aim"
    ],
    example: "a number of architectural students were designing a factory"
  }
];
