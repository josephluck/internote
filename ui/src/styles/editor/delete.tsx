import React, { useCallback } from "react";

import { deleteNote } from "../../store/notes/notes";
import { DeleteButton } from "../delete-button";

export const DeleteNoteButton: React.FunctionComponent<{ noteId: string }> = ({
  noteId,
}) => {
  const handleDelete = useCallback(() => {
    deleteNote(noteId);
  }, [noteId]);

  return <DeleteButton onClick={handleDelete} />;
};
