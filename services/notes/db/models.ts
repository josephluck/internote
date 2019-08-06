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
  /**
   * The datetime that the note was last updated
   * - timestamp in ms
   */
  dateUpdated?: number;
  /**
   * The datetime that the note was created
   * - timestamp in ms
   */
  dateCreated?: number;
}
