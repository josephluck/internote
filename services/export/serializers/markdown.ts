import {
  Schema,
  SchemaBlock,
  SchemaInline,
  ListItemBlock,
  SchemaNoneTextInline,
  SchemaMark
} from "../types";

/** Given a type of block, get the Markdown formatting prefix */
function getBlockPrefix(block: SchemaBlock): string {
  switch (block.type) {
    case "heading-one":
      return "# ";
    case "heading-two":
      return "## ";
    case "block-quote":
      return "> ";
    case "list-item":
      return "- ";
    default:
      return "";
  }
}

/** Given a type of block, get the Markdown formatting suffix */
function getBlockSuffix(block: SchemaBlock): string {
  switch (block.type) {
    default:
      return "";
  }
}

function serializeBlock(block: SchemaBlock): string {
  const prefix = getBlockPrefix(block);
  const suffix = getBlockSuffix(block);
  const content = serializeBlockContent(block);
  return `${prefix}${content}${suffix}`;
}

function serializeBlockContent(block: SchemaBlock): string {
  if (
    block.type === "image" ||
    block.type === "audio" ||
    block.type === "video"
  ) {
    return `[${block.data.name}](${block.data.src})`;
  }
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

function serializeListItem(node: ListItemBlock): string {
  return `${getBlockPrefix(node)}${node.nodes.reduce(
    (str, node) => `${str}${serializeInline(node)}`,
    ""
  )}`;
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

function getMarkFix(mark: SchemaMark): string {
  switch (mark.type) {
    case "bold":
      return "**";
    case "code":
      return "`";
    case "italic":
      return "*";
    case "underlined":
      return "__";
    default:
      return "";
  }
}

function wrapInMarks(content: string, marks: SchemaMark[]): string {
  return marks.reduce((str, mark) => {
    const fix = getMarkFix(mark);
    return `${fix}${str}${fix}`;
  }, content);
}

export function serialize(schema: Schema): string {
  return schema.nodes.reduce(
    (str, block) => `${str}${serializeBlock(block)}\n\n`,
    ""
  );
}
