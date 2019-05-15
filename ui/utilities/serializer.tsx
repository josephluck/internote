import Html from "slate-html-serializer";

export type BlockName =
  | "block-quote"
  | "paragraph"
  | "code"
  | "heading-one"
  | "heading-two"
  | "list-item"
  | "bulleted-list"
  | "numbered-list";
type FullBlockMap = Record<keyof HTMLElementTagNameMap, BlockName>;

type MarkName = "italic" | "bold" | "underlined";
type FullMarkMap = Record<keyof HTMLElementTagNameMap, MarkName>;

export type MarkType = "bold" | "italic" | "underlined" | "code";
export type BlockType =
  | "heading-one"
  | "heading-two"
  | "block-quote"
  | "numbered-list"
  | "bulleted-list";

const BLOCK_TAGS: Partial<FullBlockMap> = {
  blockquote: "block-quote",
  p: "paragraph",
  pre: "code",
  h1: "heading-one",
  h2: "heading-two",
  ul: "bulleted-list",
  ol: "numbered-list",
  li: "list-item"
};

const MARK_TAGS: Partial<FullMarkMap> = {
  em: "italic",
  strong: "bold",
  u: "underlined"
};

export const serializer = new Html({
  rules: [
    // Blocks
    {
      deserialize(el, next) {
        const type = BLOCK_TAGS[el.tagName.toLowerCase()];
        if (type) {
          return {
            object: "block",
            type: type,
            data: {
              className: el.getAttribute("class")
            },
            nodes: next(el.childNodes)
          };
        }
      },
      serialize(obj, children) {
        if (obj.object == "block") {
          switch (obj.type) {
            case "code":
              return (
                <pre>
                  <code>{children}</code>
                </pre>
              );
            case "block-quote":
              return <blockquote>{children}</blockquote>;
            case "heading-one":
              return <h1>{children}</h1>;
            case "heading-two":
              return <h2>{children}</h2>;
            case "numbered-list":
              return <ol>{children}</ol>;
            case "bulleted-list":
              return <ul>{children}</ul>;
            case "list-item":
              return <li>{children}</li>;
            default:
              return <p>{children}</p>;
          }
        }
      }
    },
    // Marks
    {
      deserialize(el, next) {
        const type = MARK_TAGS[el.tagName.toLowerCase()];
        if (type) {
          return {
            object: "mark",
            type: type,
            nodes: next(el.childNodes)
          };
        }
      },
      serialize(obj, children) {
        if (obj.object == "mark") {
          switch (obj.type) {
            case "bold":
              return <strong>{children}</strong>;
            case "italic":
              return <em>{children}</em>;
            case "underlined":
              return <u>{children}</u>;
            default:
              return <p>{children}</p>;
          }
        }
      }
    }
  ]
});
