import { useDebounce } from "../../utilities/hooks";
import { useEffect, useRef } from "react";
import { useTwineActions } from "../../store";
import { Node } from "slate";
import { extractTitleFromValue } from "./utils";

export const useLiveSave = (value: Node[], noteId: string) => {
  const isFirst = useRef(true);

  // console.log(value);

  const save = useTwineActions(
    (actions) => (content: Node[]) =>
      actions.notes.updateNote({
        content,
        noteId,
        tags: [],
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
