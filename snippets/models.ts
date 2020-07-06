import { InternoteEditorValue } from "@internote/lib/editor-types";

export class Snippet {
  /**
   * Snippet id
   */
  snippetId: string = "";
  /**
   * Cognito identity ID for the user
   */
  userId: string = "";
  /**
   * The title of the snippet.
   */
  title: string = "";
  /**
   * The content of snippet
   */
  content: InternoteEditorValue = [];
}
