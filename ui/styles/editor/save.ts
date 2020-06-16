import { useDebounce } from "../../utilities/hooks";
import { useEffect, useRef } from "react";
import { useTwineActions } from "../../store";
import { extractTitleFromValue, extractTagsFromValue } from "./utils";
import { InternoteEditorElement } from "./types";

export const useLiveSave = (
  value: InternoteEditorElement[],
  noteId: string
) => {
  const isFirst = useRef(true);

  const save = useTwineActions(
    (actions) => (content: InternoteEditorElement[]) =>
      actions.notes.updateNote({
        content,
        noteId,
        tags: extractTagsFromValue(content),
        title: extractTitleFromValue(content),
      }),
    [noteId]
  );

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    save(debouncedValue);
  }, [debouncedValue]);
};
