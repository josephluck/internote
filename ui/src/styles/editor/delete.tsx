import React, { useCallback } from "react";

import { deleteNote } from "../../store/notes/notes";
import { useConfirm } from "../confirmation";
import { DeleteButton } from "../delete-button";

export const DeleteNoteButton: React.FunctionComponent<{ noteId: string }> = ({
  noteId,
}) => {
  const confirm = useConfirm();
  const handleDelete = useCallback(async () => {
    const result = await confirm({
      message: "Are you sure you want to delete this note?",
    });
    if (result.hasConfirmed) {
      result.setConfirmLoading(true);
      await deleteNote(noteId);
      result.hideConfirmation();
    }
  }, [noteId]);

  return <DeleteButton onClick={handleDelete} />;
};
