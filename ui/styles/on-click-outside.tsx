import * as React from "react";
import * as ReactDOM from "react-dom";

/**
 * A component that exposes a callback when a click
 * occurs outside it.
 *
 * NB: if this is used on elements that are shown as a
 * result of a click event (i.e. modal, bottom-sheet, tray)
 * then the click event's propagation needs to be stopped
 * via event.stopPropagation() to avoid this component's
 * onClickOutside callback being immediately called
 * (resulting in immediately dismissing the modal).
 */
export function OnClickOutside({
  children,
  onClickOutside,
  disabled,
  className
}: {
  children: React.ReactNode;
  onClickOutside?: (e: MouseEvent) => any;
  disabled?: boolean;
  className?: string;
}) {
  const wrappingRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      // NB: clickedElementStillExists is required because when clicking
      // an element inside a component wrapped inside OnClickOutside
      // that gets unmounted when clicked, this method will fire and
      // the condition for closure will fire.

      const clickedElementStillExists = document.body.contains(
        e.target as HTMLElement
      );

      if (
        wrappingRef.current &&
        disabled !== true &&
        clickedElementStillExists
      ) {
        const wrappingElement = ReactDOM.findDOMNode(wrappingRef.current);
        if (
          wrappingElement &&
          !wrappingElement.contains(e.target as HTMLElement) &&
          onClickOutside
        ) {
          onClickOutside(e);
        }
      }
    }
    window.addEventListener("click", onClick);
    return function() {
      window.removeEventListener("click", onClick);
    };
  }, [disabled]);

  return (
    <div ref={wrappingRef} className={className || ""}>
      {children}
    </div>
  );
}
