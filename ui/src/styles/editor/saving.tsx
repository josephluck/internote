import { useTwineState } from "../../store";
import { Saving } from "../saving";

export const NoteSavingIndicator = () => {
  const isSaving = false;
  return <Saving saving={isSaving} />;
};
