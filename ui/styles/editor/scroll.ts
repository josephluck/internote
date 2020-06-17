import { useCallback, useRef, useState, useEffect } from "react";
import zenscroll from "zenscroll";
import {
  findAncestor,
  SLATE_BLOCK_CLASS_NAME,
  SLATE_BLOCK_FOCUSED_CLASS_NAME,
} from "./focus";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { useCurrentSelection } from "./hooks";

export const useDistractionFreeUx = (
  scrollRef: React.MutableRefObject<HTMLDivElement>
) => {
  const [
    userHasScrolledOutOfDistractionMode,
    setUserHasScrolledOutOfDistractionMode,
  ] = useState(false);

  const scroller = useRef(zenscroll.createScroller(scrollRef.current, 200));

  const autoScrolling = useRef(false);

  const scrollEditorToElement = useCallback((element: HTMLElement) => {
    autoScrolling.current = true;
    scroller.current.center(element, 100, 0, () => {
      requestAnimationFrame(() => {
        autoScrolling.current = false;
        setUserHasScrolledOutOfDistractionMode(false);
      });
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!autoScrolling.current) {
      setUserHasScrolledOutOfDistractionMode(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scroller.current = zenscroll.createScroller(scrollRef.current, 200);
      scrollRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      scrollRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef.current, handleScroll]);

  const selection = useCurrentSelection();

  useEffect(() => {
    pipe(
      O.fromNullable(document.getSelection()),
      O.filterMap((selection) => O.fromNullable(selection.anchorNode)),
      O.filterMap(findAncestor(SLATE_BLOCK_CLASS_NAME)),
      O.map((focusedBlockNode) => {
        removeCurrentFocusedBlockClassName();
        focusedBlockNode.classList.add(SLATE_BLOCK_FOCUSED_CLASS_NAME);
        autoScrolling.current = true;
        scrollEditorToElement(focusedBlockNode);
      })
    );
  }, [selection]);

  return {
    userHasScrolledOutOfDistractionMode,
  };
};

const removeCurrentFocusedBlockClassName = () =>
  pipe(
    O.fromNullable(
      document.querySelector(`.${SLATE_BLOCK_FOCUSED_CLASS_NAME}`)
    ),
    O.map((elm) => elm.classList.remove(SLATE_BLOCK_FOCUSED_CLASS_NAME))
  );
