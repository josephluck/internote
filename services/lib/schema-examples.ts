import { InternoteEditorElement } from "./editor-types";

export const EMPTY_SCHEMA: InternoteEditorElement[] = [
  {
    type: "heading-one",
    children: [
      {
        text: " ",
      },
    ],
  },
];

export const FULL_SCHEMA_EXAMPLE: InternoteEditorElement[] = [
  {
    type: "heading-one",
    children: [
      {
        text: "👋 Welcome to Internote",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Internote is a rich text editor designed for effortless content creation.",
      },
    ],
  },
  {
    type: "heading-two",
    children: [
      {
        text: "Features",
      },
    ],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "Bold, ",
            bold: true,
          },
          {
            text: "italic, ",
            italic: true,
          },
          {
            text: "underline",
            underline: true,
          },
          {
            text: " and ",
          },
          {
            text: "combinations",
            bold: true,
            underline: true,
            italic: true,
          },
          {
            text: ". ",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Integrated oxford dictionary",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Text-to-speech",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Emojis, ",
          },
          {
            type: "tag",
            tag: "#hashtags",
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: " and ",
          },
          {
            text: "code snippets",
            code: true,
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Multiple colour and typography themes",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Export as HTML and Markdown",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Distraction-free mode",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Passwordless login",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Fullscreen mode",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Rich keyboard shortcuts",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Automatic save",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Outline navigation",
          },
        ],
      },
    ],
  },
  {
    type: "block-quote",
    children: [
      {
        text: "blockquotes",
      },
    ],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "Numbered lists",
          },
        ],
      },
    ],
  },
  {
    type: "heading-two",
    children: [
      {
        text: "Premium ",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Internote is currently in ",
      },
      {
        text: "beta",
        bold: true,
      },
      {
        text:
          ". Any content you write here may be removed at any time. You've been warned! However, whilst Internote is in beta, all features will remain free.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
];
