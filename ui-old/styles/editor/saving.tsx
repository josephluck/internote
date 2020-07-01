import { useTwineState } from "../../store";
import { Saving } from "../saving";

export const NoteSavingIndicator = () => {
  const isSaving = useTwineState((state) => state.notes.loading.updateNote);
  return <Saving saving={isSaving} />;
};
