import {
  Schema,
  SchemaBlock,
  SchemaInline,
  ListItemBlock,
  SchemaNoneTextInline,
  SchemaMark
} from "../types";

/** Given a type of block, get the HTML tag (not including the <> or </> ) */
function getBlockTag(block: SchemaBlock): string {
  switch (block.type) {
    case "heading-one":
      return "h1";
    case "heading-two":
      return "h2";
    case "block-quote":
      return "quote";
    case "numbered-list":
      return "ol";
    case "bulleted-list":
      return "ul";
    case "list-item":
      return "li";
    case "ide":
      return "pre";
    case "video":
      return "video";
    case "image":
      return "img";
    case "audio":
      return "audio";
    default:
      return "p";
  }
}

function getBlockAttributes(block: SchemaBlock): string {
  switch (block.type) {
    case "video":
    case "image":
    case "audio":
      return `src="${block.data.src}"`;
    default:
      return "";
  }
}

function serializeBlock(block: SchemaBlock): string {
  const tag = getBlockTag(block);
  const content = serializeBlockContent(block);
  const attributes = getBlockAttributes(block);
  return `<${tag}${attributes ? ` ${attributes}` : ""}>${content}</${tag}>`;
}

function serializeBlockContent(block: SchemaBlock): string {
  if (block.type === "ide") {
    return block.data.content;
  } else {
    const nodes = block.nodes as (ListItemBlock | SchemaInline)[];
    return nodes.reduce((str, node: ListItemBlock | SchemaInline, index) => {
      if (node.type === "list-item") {
        const newLine = index < nodes.length - 1 ? "\n" : "";
        return `${str}${serializeListItem(node)}${newLine}`;
      } else {
        return `${str}${serializeInline(node)}`;
      }
    }, "");
  }
}

function serializeListItem(node: ListItemBlock): string {
  const tag = getBlockTag(node);
  return `<${tag}>${node.nodes.reduce(
    (str, node) => `${str}${serializeInline(node)}`,
    ""
  )}</${tag}>`;
}

function serializeInline(node: SchemaInline): string {
  switch (node.object) {
    case "text":
      return wrapInMarks(node.text, node.marks);
    default:
      return serializeNonTextInline(node);
  }
}

function serializeNonTextInline(node: SchemaNoneTextInline): string {
  switch (node.type) {
    case "emoji":
      return node.data.code;
    case "tag":
      return node.data.tag;
    default:
      return "";
  }
}

function getMarkTag(mark: SchemaMark): string {
  switch (mark.type) {
    case "bold":
      return "strong";
    case "code":
      return "code";
    case "italic":
      return "i";
    case "underlined":
      return "u";
    default:
      return "";
  }
}

function wrapInMarks(content: string, marks: SchemaMark[]): string {
  return marks.reduce((str, mark) => {
    const tag = getMarkTag(mark);
    return `<${tag}>${str}</${tag}>`;
  }, content);
}

export function serialize(schema: Schema): string {
  return schema.nodes.reduce(
    (str, block) => `${str}${serializeBlock(block)}\n\n`,
    ""
  );
}
