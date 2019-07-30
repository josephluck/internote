export class Note {
  /**
   * Note id
   */
  noteId: string;
  /**
   * Cognito identity ID for the user
   */
  userId: string;
}

export const defaultNote: Note = {
  noteId: "",
  userId: ""
};
