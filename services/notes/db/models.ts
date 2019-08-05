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
