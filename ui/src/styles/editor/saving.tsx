import React from "react";

import { Saving } from "../saving";

export const NoteSavingIndicator = () => {
  const isSaving = false; // TODO: somehow
  return <Saving saving={isSaving} />;
};
