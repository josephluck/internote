import Html from "slate-html-serializer";

type BlockName = "quote" | "paragraph" | "code";
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
  blockquote: "quote",
  p: "paragraph",
  pre: "code"
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
            case "quote":
              return <blockquote>{children}</blockquote>;
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
