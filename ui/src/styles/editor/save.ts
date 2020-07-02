import { InternoteEditorElement } from "@internote/lib/editor-types";
import { useEffect, useRef } from "react";

import { updateNote } from "../../store/notes";
import { useDebounce } from "../../utilities/hooks";
import { extractTagsFromValue, extractTitleFromValue } from "./utils";

export const useLiveSave = (
  value: InternoteEditorElement[],
  noteId: string
) => {
  const isFirst = useRef(true);

  const save = (content: InternoteEditorElement[]) =>
    updateNote({
      content,
      noteId,
      tags: extractTagsFromValue(content),
      title: extractTitleFromValue(content),
    });

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    save(debouncedValue);
  }, [debouncedValue]);
};
