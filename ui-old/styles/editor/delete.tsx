import { useCallback } from "react";

import { useTwineActions } from "../../store";
import { DeleteButton } from "../delete-button";

export const DeleteNoteButton: React.FunctionComponent<{ noteId: string }> = ({
  noteId,
}) => {
  const doDelete = useTwineActions(
    (actions) => actions.notes.deleteNoteConfirmation
  );
  const handleDelete = useCallback(() => {
    doDelete({ noteId });
  }, [noteId]);

  return <DeleteButton onClick={handleDelete} />;
};