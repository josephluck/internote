import { InternoteEditorElement, ParagraphElement, TagElement } from "./types";
import { extractAllTagElementsFromValue, flattenEditorElements } from "./utils";

describe("Extract tags", () => {
  it("Flattens nested nodes", () => {
    const elements = flattenEditorElements([
      makeParagraph("Hello", [
        makeTag("#1"),
        makeParagraph("world", [makeTag("#2")]),
      ]),
      makeTag("#3"),
    ]);

    expect(elements).toHaveLength(10);

    const elementTypes = elements
      .filter((element) => !!element.type)
      .map((element) => element.type);

    expect(elementTypes).toHaveLength(5);
    expect(elementTypes).toEqual([
      "paragraph",
      "tag",
      "paragraph",
      "tag",
      "tag",
    ]);
  });

  it("Gets all tag elements from a value", () => {
    const tags = extractAllTagElementsFromValue([
      makeParagraph("Hello", [makeTag("#1")]),
      makeTag("#2"),
    ]);
    expect(tags).toHaveLength(2);

    const tagStrings = tags.map((tag) => tag.tag);
    expect(tagStrings).toEqual(["#1", "#2"]);
  });
});

const makeParagraph = (
  content: string,
  children: InternoteEditorElement[] = []
): ParagraphElement => ({
  type: "paragraph",
  children: [{ text: content }, ...children],
});

const makeTag = (tag: string): TagElement => ({
  tag,
  type: "tag",
  // @ts-ignore
  children: [{ text: "" }],
});
