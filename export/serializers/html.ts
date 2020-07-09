import { InternoteEditorElement } from "@internote/lib/editor-types";
import escapeHtml from "escape-html";
import { Text } from "slate";

const serializeText = (node: InternoteEditorElement): string => {
  if (node.bold) {
    return `<strong>${serializeText({ ...node, bold: false })}</strong>`;
  }
  if (node.italic) {
    return `<i>${serializeText({ ...node, italic: false })}</i>`;
  }
  if (node.underline) {
    return `<u>${serializeText({ ...node, underline: false })}</u>`;
  }
  return escapeHtml(node.text);
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
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "tag":
      return node.tag;
    case "block-quote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${node.href}">${children}</a>`;
    default:
      return children;
  }
};

export const serializeHtml = (nodes: InternoteEditorElement[]) =>
  nodes.map(serialize).join("");
