import { InternoteEditorElement } from "@internote/lib/editor-types";
import { Text } from "slate";

const serializeText = (node: InternoteEditorElement): string => {
  if (node.bold) {
    return `**${serializeText({ ...node, bold: false })}**`;
  }
  if (node.italic) {
    return `*${serializeText({ ...node, italic: false })}*`;
  }
  if (node.underline) {
    return `_${serializeText({ ...node, underline: false })}_`;
  }
  return (node.text as string) || "";
};

const serialize = (node: InternoteEditorElement): string => {
  if (Text.isText(node)) {
    return serializeText(node);
  }

  const children = node.children
    .map((n) => serialize(n as InternoteEditorElement))
    .join("");

  switch (node.type) {
    case "heading-one":
      return `# ${children}\n`;
    case "heading-two":
      return `## ${children}\n`;
    case "bulleted-list":
      return `${children}`;
    case "numbered-list":
      return `${children}`;
    case "list-item":
      return `- ${children}\n`; // TODO: numbered list
    case "tag":
      return node.tag;
    case "block-quote":
      return `> ${children}\n`;
    case "paragraph":
      return `${children}\n`;
    case "link":
      return `[${children}](${node.href})`;
    default:
      return `${children}\n`;
  }
};

export const serializeMarkdown = (nodes: InternoteEditorElement[]) =>
  nodes.map(serialize).join("\n");
