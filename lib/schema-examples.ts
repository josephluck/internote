import { InternoteEditorElement } from "./editor-types";

export const EMPTY_SCHEMA: InternoteEditorElement[] = [
  {
    type: "heading-one",
    children: [
      {
        text: "",
      },
    ],
  },
];

export const FULL_SCHEMA_WELCOME_MESSAGE: InternoteEditorElement[] = [
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
          "Internote is a rich text editor designed for effortless content creation. ",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "It's super easy to get started, try editing this page to get a feel for things or ",
      },
      {
        type: "link",
        href: "/authenticate",
        openImmediately: true,
        children: [
          {
            text: "sign in",
          },
        ],
      },
      {
        text: " to save your notes and access Internote's rich features.",
      },
    ],
  },
  {
    type: "block-quote",
    children: [
      {
        text: "⚠ Internote is currently in ",
      },
      {
        text: "beta.",
        bold: true,
        underline: true,
      },
      {
        text:
          " Any content you write here may be removed at any time. You've been warned! However, whilst Internote is in beta, all features will remain free.",
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
            text: "underline,",
            underline: true,
          },
          {
            text: " italic",
            italic: true,
          },
          {
            text: " and ",
          },
          {
            text: "combinations",
            bold: true,
            italic: true,
            underline: true,
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
            text: "Emojis 😍 ",
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
            text: "Full-screen mode",
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
            text: "Outline navigation",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Reusable snippets",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "List items",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Block quotes",
          },
        ],
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
            text: "And many more",
          },
        ],
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
      {
        type: "link",
        href: "/authenticate",
        openImmediately: true,
        children: [
          {
            text: "Sign up",
          },
        ],
      },
      {
        text: " or ",
      },
      {
        type: "link",
        href: "/authenticate",
        openImmediately: true,
        children: [
          {
            text: "sign in",
          },
        ],
      },
      {
        text: " to get started.",
      },
    ],
  },
];
