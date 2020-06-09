import { useCallback, useRef, useState, useEffect } from "react";
import zenscroll from "zenscroll";
import { InternoteSlateEditor } from "./types";
import { useNodeFocus } from "./focus";

export const useScrollFocus = (
  editor: InternoteSlateEditor,
  scrollRef: React.MutableRefObject<HTMLDivElement>
) => {
  const { getCurrentFocusedHTMLNode } = useNodeFocus(editor);
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
        setUserHasScrolledOutOfDistractionMode(false);
        autoScrolling.current = false;
      });
    });
  }, []);

  const handleUserHasScrolledEditor = useCallback(() => {
    if (!autoScrolling.current) {
      setUserHasScrolledOutOfDistractionMode(true);
    }
  }, []);

  const scrollToFocusedNode = useCallback(() => {
    const focusedNode = getCurrentFocusedHTMLNode();
    if (focusedNode) {
      autoScrolling.current = true;
      scrollEditorToElement(focusedNode);
    }
  }, [scrollRef.current, getCurrentFocusedHTMLNode, scrollEditorToElement]);

  useEffect(() => {
    const handleClick = () => setTimeout(scrollToFocusedNode, 100);
    const handleScroll = () => handleUserHasScrolledEditor();
    if (scrollRef.current) {
      scroller.current = zenscroll.createScroller(scrollRef.current, 200);
      scrollRef.current.addEventListener("scroll", handleScroll);
      scrollRef.current.addEventListener("click", handleClick);
    }
    return () => {
      scrollRef.current.removeEventListener("scroll", handleScroll);
      scrollRef.current.removeEventListener("click", handleClick);
    };
  }, [
    scrollRef.current,
    autoScrolling.current,
    handleUserHasScrolledEditor,
    scrollToFocusedNode,
  ]);

  return {
    scrollToFocusedNode,
    userHasScrolledOutOfDistractionMode,
  };
};
