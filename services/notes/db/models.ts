import { GetNoteDTO } from "../types";

export class Note {
  /**
   * Note id
   */
  noteId: string;
  /**
   * Cognito identity ID for the user
   */
  userId: string;
  /**
   * The title of the note.
   */
  title: string;
  /**
   * The content of the note as a compressed
   * binary string.
   *
   * NB: compressed since DynamoDB has a 400kb limit
   * on items.
   */
  content: string;
  /**
   * The tags added to the note
   *
   * NB: this is a set of strings.
   */
  tags: string[];
}

export const defaultNote: GetNoteDTO = {
  noteId: "",
  userId: "",
  content: {
    object: "value",
    document: {
      object: "document",
      data: {},
      nodes: [
        {
          object: "block",
          type: "heading-one",
          data: { className: null },
          nodes: [
            { object: "text", text: "New note - Wed May 15 2019", marks: [] }
          ]
        },
        {
          object: "block",
          type: "paragraph",
          data: { className: null },
          nodes: [{ object: "text", text: "", marks: [] }]
        },
        {
          object: "block",
          type: "heading-two",
          data: { className: null },
          nodes: [{ object: "text", text: "Internote", marks: [] }]
        },
        {
          object: "block",
          type: "paragraph",
          data: { className: null },
          nodes: [
            {
              object: "text",
              text:
                "Internote is a rich text editor designed for distraction-free content creation.",
              marks: []
            }
          ]
        },
        {
          object: "block",
          type: "paragraph",
          data: { className: null },
          nodes: [
            {
              object: "text",
              text:
                "Internote supports a myriad of different formatting options including ",
              marks: []
            },
            {
              object: "text",
              text: "bold, ",
              marks: [{ object: "mark", type: "bold", data: {} }]
            },
            {
              object: "text",
              text: "italic ",
              marks: [{ object: "mark", type: "italic", data: {} }]
            },
            { object: "text", text: "and ", marks: [] },
            {
              object: "text",
              text: "underline",
              marks: [{ object: "mark", type: "underlined", data: {} }]
            },
            {
              object: "text",
              text: " as well as lists, code snippets, headings and quotes.",
              marks: []
            }
          ]
        },
        {
          object: "block",
          type: "paragraph",
          data: { className: null },
          nodes: [
            {
              object: "text",
              text:
                "Internote automatically saves your notes in the cloud and is completely free.",
              marks: []
            }
          ]
        }
      ]
    }
  },
  title: "New note",
  tags: []
};
